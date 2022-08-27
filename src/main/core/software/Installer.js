import App from "@/main/App";
import path from "path";
import child_process from "child_process";
import {EnumSoftwareInstallStatus} from "@/shared/enum";
import extract from "extract-zip";
import Software from "@/main/core/software/Software";
import GetPath from "@/shared/utils/GetPath";
import Database from "@/main/core/Database";

export default class Installer {
    item;

    /**
     *
     * @param softItem {SoftwareItem}
     */
    constructor(softItem) {
        this.item = softItem;
        this.item.installInfo = this.item.installInfo ? this.item.installInfo : {}
        this.item.installInfo.status = EnumSoftwareInstallStatus.Ready;
        this.resetDownloadInfo();
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
        try {
            await this.download();
        } catch (error) {
            this.changeStatus(EnumSoftwareInstallStatus.DownloadError);
            let errMsg = error.message ? error.message : '未知错误';
            throw new Error(`下载出错，${errMsg}`);
        }

        if (App.isDev()) console.log('判断是否下载完成')

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
            let errMsg = error.message ? error.message : '未知错误';
            throw new Error(`解压出错，${errMsg}`);
        }

        try {
            // eslint-disable-next-line no-constant-condition
            if ('mysql'===1) {
                Database.InitMySQL();
            }
        } catch (error) {
            let errMsg = error.message ? error.message : '未知错误';
            throw new Error(`安装出错，${errMsg}`);
        }

        this.changeStatus(EnumSoftwareInstallStatus.Finish);
    }

    async download() {
        return await new Promise((resolve, reject) => {
            let corePath = App.getUserCorePath();
            let downloaderPath = path.join(corePath, 'aria2c');
            let downloadsPath = path.join(corePath, 'downloads');
            let url = 'https://dl-cdn.phpenv.cn/release/test.zip';
            let args = [url, '--check-certificate=false', '--allow-overwrite=true', `--dir=${downloadsPath}`];

            let dlProcess = child_process.spawn(downloaderPath, args);
            this.changeStatus(EnumSoftwareInstallStatus.Downloading);
            const progressRegx = /([\d.]+\w+)\/([\d.]+\w+)\((\d+)%\).+DL:([\d.]+\w+)/;
            const errRegx = /errorCode=\d+.+/g;

            // 触发abort
            function abortDownload() {
                dlProcess.kill();
            }

            if (this.downloadSignal) {
                //当 abort() 被调用时，这个promise 不会 reject 一个名为 AbortError 的 DOMException
                this.downloadSignal.addEventListener('abort', abortDownload)
            }

            dlProcess.stdout.on('data', (data) => {
                data = data.toString();
                if (App.isDev()) console.log(data)
                let matches = data.match(progressRegx)
                if (matches) {
                    this.setDownloadInfo({
                        completedSize: matches[1].replace('i', ''),
                        totalSize: matches[2].replace('i', ''),
                        percent: parseFloat(matches[3]),
                        perSecond: matches[4].replace('i', ''),
                    })
                } else {
                    let errMatches = data.match(errRegx)
                    if (errMatches && errMatches.length > 0) {
                        this.errMsg = errMatches.pop();
                    }
                }
            });

            dlProcess.on('close', (code) => {
                if (this.downloadSignal) {
                    this.downloadSignal.removeEventListener('abort', abortDownload);
                }
                if (code == null) {
                    this.changeStatus(EnumSoftwareInstallStatus.Abort);
                    return resolve(true);
                }
                if (code === 0) {
                    this.changeStatus(EnumSoftwareInstallStatus.Downloaded);
                    this.setDownloadInfo({percent: 100})
                    return resolve(true);
                }
                console.log('errMsg', this.errMsg)
                reject(new Error(this.errMsg));
            });

        });

    }

    changeStatus(status) {
        this.item.installInfo.status = status;
    }

    async zipExtract() {
        let softItem = this.item;
        softItem.DirName = 'test';
        let filePath = path.join(GetPath.getDownloadsPath(), `HandyControl.git.zip`);
        let typePath = Software.getTypePath(softItem.Type)
        this.changeStatus(EnumSoftwareInstallStatus.Extracting);
        return await extract(filePath, {dir: typePath});
    }

}
