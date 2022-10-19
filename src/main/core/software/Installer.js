import App from "@/main/App";
import path from "path";
import {EnumSoftwareInstallStatus} from "@/shared/enum";
import extract from "extract-zip";
import Software from "@/main/core/software/Software";
import Database from "@/main/core/Database";
import is from "electron-is";
import {DOWNLOAD_URL} from "@/shared/constant";
import Directory from "@/main/utils/Directory";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import got from "got";
import {pipeline} from "stream/promises";
import {createWriteStream} from "fs";
import Path from "@/main/utils/Path";
import File from "@/main/utils/File";

export default class Installer {
    item; //用于和前端对接数据
    fileName;
    filePath; //下载文件路径
    tempFilePath; //临时下载文件路径
    dlInfo; //下载信息
    /**
     *
     * @param softItem {SoftwareItem}
     */
    constructor(softItem) {
        this.item = softItem;
        this.item.installInfo = this.item.installInfo ? this.item.installInfo : {}
        this.item.installInfo.status = EnumSoftwareInstallStatus.Ready;
        this.item.installInfo.dlAbortController = new AbortController();
        this.item.installInfo.dlIntervalId = 0;
        this.resetDownloadInfo();

        this.fileName = `${this.item.DirName}.zip`;
        this.filePath = Path.Join(this.getDownloadsPath(), this.fileName);
        this.tempFilePath = `${this.filePath}.dl`;
    }

    resetDownloadInfo() {
        this.dlInfo = {
            completedSize: 0,
            totalSize: 0,
            percent: 0,
        }
        this.item.installInfo.dlInfo = {
            completedSizeText: '',
            totalSizeText: '',
            percent: 0,
            perSecondText: '0KB',
        }
    }

    setDownloadInfo(dlInfo) {
        if (dlInfo.completedSize) {
            this.dlInfo.completedSize = dlInfo.completedSize;
        }
        if (dlInfo.totalSize) {
            this.dlInfo.totalSize = dlInfo.totalSize;
        }
        if (dlInfo.percent) {
            this.dlInfo.percent = dlInfo.percent;
        }
    }

    setItemDownloadInfo(dlInfo) {
        if (dlInfo.completedSizeText) {
            this.item.installInfo.dlInfo.completedSizeText = dlInfo.completedSizeText;
        }
        if (dlInfo.totalSizeText) {
            this.item.installInfo.dlInfo.totalSizeText = dlInfo.totalSizeText;
        }
        if (dlInfo.percent) {
            this.item.installInfo.dlInfo.percent = dlInfo.percent;
        }
        if (dlInfo.perSecondText) {
            this.item.installInfo.dlInfo.perSecondText = dlInfo.perSecondText;
        }
    }

    async install() {
        this.resetDownloadInfo();

        if(File.Exists(this.tempFilePath)){
            File.Delete(this.tempFilePath);
        }

        try {
            await this.download();
            clearInterval(this.item.installInfo.dlIntervalId);
        } catch (error) {
            clearInterval(this.item.installInfo.dlIntervalId);
            this.changeStatus(EnumSoftwareInstallStatus.DownloadError);
            let errMsg = error.message ?? '未知错误';
            throw new Error(`下载出错，${errMsg}`);
        }

        if (this.item.installInfo.status !== EnumSoftwareInstallStatus.Downloaded) {
            this.changeStatus(EnumSoftwareInstallStatus.Abort);
            return;
        }

        if (App.isDev()) console.log('开始解压...')

        try {
            await this.zipExtract();
            this.changeStatus(EnumSoftwareInstallStatus.Extracted);
        } catch (error) {
            this.changeStatus(EnumSoftwareInstallStatus.ExtractError);
            let errMsg = error.message ?? '未知错误';
            throw new Error(`解压出错，${errMsg}`);
        }

        try {
            if (this.item.DirName.includes('mysql')) {
                this.changeStatus(EnumSoftwareInstallStatus.Configuring);
                await Database.initMySQL(SoftwareExtend.getMysqlVersion(this.item.DirName));
            }
        } catch (error) {
            let errMsg = error.message ?? '未知错误';
            throw new Error(`配置出错，${errMsg}`);
        }

        this.changeStatus(EnumSoftwareInstallStatus.Finish);
    }

    getDownloadUrl() {
        let url
        if (is.windows()) {
            url = `${DOWNLOAD_URL}/win`;
        } else {
            url = `${DOWNLOAD_URL}/mac`;
        }
        return `${url}/software/${this.fileName}`;
    }

    async download() {
        return await new Promise((resolve, reject) => {

            let url = this.getDownloadUrl();
            let readStream = got.stream(url, {timeout: {response:5000}}); //todo下载超时，response并不管用

            process.on('uncaughtException', error => {
                return reject(new Error(error.message));
            });

            if (App.isDev()) console.log('downloadUrl',url)
            if (App.isDev()) console.log('filePath',this.filePath)

            this.changeStatus(EnumSoftwareInstallStatus.Downloading);

            readStream.on('response', async () => {
                try {
                    await pipeline(
                        readStream,
                        createWriteStream(this.tempFilePath),
                        {signal: this.item.installInfo.dlAbortController.signal});
                    this.setItemDownloadInfo({percent: 100});
                    this.changeStatus(EnumSoftwareInstallStatus.Downloaded);
                    File.Move(this.tempFilePath, this.filePath);
                    return resolve(true);
                } catch (error) {
                    if (error.name === "AbortError") {
                        this.changeStatus(EnumSoftwareInstallStatus.Abort);
                        return resolve(true);
                    } else {
                        return reject(new Error(error.message));
                    }
                }
            })

            readStream.on('downloadProgress', downloadProgress => {
                this.setDownloadInfo({
                    completedSize: downloadProgress.transferred,
                    totalSize: downloadProgress.total,
                    percent: downloadProgress.percent,
                })
            });

            let beforeCompletedSize = 0;
            this.item.installInfo.dlIntervalId = setInterval(() => {
                let dlInfo = this.dlInfo;
                this.setItemDownloadInfo({
                    completedSizeText: this.getSizeText(dlInfo.completedSize),
                    totalSizeText: this.getSizeText(dlInfo.totalSize),
                    percent :  parseInt(dlInfo.percent * 100),
                    perSecondText: this.getSizeText(dlInfo.completedSize - beforeCompletedSize),
                })
                beforeCompletedSize = dlInfo.completedSize;
                if (App.isDev()) console.log('Call setInterval',url);
            }, 1000);

        });

    }

    getSizeText(byteSize){
        if(byteSize > 1024*1024){
            return parseInt(byteSize/(1024*1024)) + 'MB';
        }
        return parseInt(byteSize/1024) + 'KB';
    }

    static stopDownload(item) {
        item.installInfo.dlAbortController.abort();
        clearInterval(item.installInfo.dlIntervalId);
    }

    changeStatus(status) {
        this.item.installInfo.status = status;
    }

    async zipExtract() {
        let filePath = path.join(this.getDownloadsPath(), this.fileName);
        let typePath = Software.getTypePath(this.item.Type)

        this.changeStatus(EnumSoftwareInstallStatus.Extracting);
        return await extract(filePath, {dir: typePath});
    }

     getDownloadsPath() {
        return path.join(App.getUserCorePath(), 'downloads');
    }


    getStdbufPath() {
        return path.join(App.getCorePath(), 'stdbuf');
    }

    static uninstall(item) {
        let path = Software.getPath(item);
        if (Directory.Exists(path)) {
            Directory.Delete(path, true);
        }
    }
}
