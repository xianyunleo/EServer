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
    item;
    fileName;
    filePath;
    tempFilePath;
    dlAbortController;
    /**
     *
     * @param softItem {SoftwareItem}
     */
    constructor(softItem) {
        this.item = softItem;
        this.item.installInfo = this.item.installInfo ? this.item.installInfo : {}
        this.item.installInfo.status = EnumSoftwareInstallStatus.Ready;
        this.resetDownloadInfo();
        this.fileName = `${this.item.DirName}.zip`;
        let downloadsPath = this.getDownloadsPath();
        this.filePath = Path.Join(downloadsPath, this.fileName);
        this.tempFilePath = `${this.filePath}.dl`;
        this.downloadSignal = this.item.downloadAbortController?.signal;
    }

    resetDownloadInfo() {
        this.item.installInfo.dlInfo = {
            completedSize: 0,
            totalSize: 0,
            percent: 0,
            perSecond: '0KB',
        }
    }

    setDownloadInfo(dlInfo) {
        if (dlInfo.completedSize) {
            this.item.installInfo.dlInfo.completedSize = dlInfo.completedSize;
        }
        if (dlInfo.totalSize) {
            this.item.installInfo.dlInfo.totalSize = dlInfo.totalSize;
        }
        if (dlInfo.percent) {
            this.item.installInfo.dlInfo.percent = dlInfo.percent;
        }
        if (dlInfo.perSecond) {
            this.item.installInfo.dlInfo.perSecond = dlInfo.perSecond;
        }
    }

    async install() {
        this.resetDownloadInfo();

        if(File.Exists(this.tempFilePath)){
            File.Delete(this.tempFilePath);
        }

        try {
            await this.download();
        } catch (error) {
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
                Database.initMySQL(SoftwareExtend.getMysqlVersion(this.item.DirName));
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
                        {signal: this.downloadSignal});
                    this.setDownloadInfo({percent: 100});
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
                    completedSize: '开发中',
                    totalSize: '开发中',
                    percent: parseFloat(downloadProgress.percent * 100),
                    perSecond: '开发中',
                })
            });

        });

    }

    static stopDownload() {
        this.dlAbortController.abort();
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
        Directory.Delete(path, true);
    }
}
