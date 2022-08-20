import App from "@/main/App";
import path from "path";
import child_process from "child_process";
import is from "electron-is";
import {SoftwareInstallStatus} from "@/main/enum";
import extract from "extract-zip";
import Software from "@/main/software/Software";
import GetPath from "@/main/GetPath";


export default class Installer {
    softItem;

    constructor(softItem) {
        this.softItem = softItem;
        this.softItem.installInfo = this.softItem.installInfo ? this.softItem.installInfo : {}
        this.softItem.installInfo.status = SoftwareInstallStatus.Ready;
        this.resetDownloadInfo();
        this.downloadSignal = this.softItem.downloadAbortController?.signal;
        this.softItem.url = 'https://dl-cdn.phpenv.cn/release/test.zip';
    }

    resetDownloadInfo() {
        this.softItem.installInfo.dlInfo = {
            completedSize: 0,
            totalSize: 0,
            percent: 0,
            perSecond: '0KB',
        }
    }

    setDownloadInfo(dlInfo) {
        if (dlInfo.completedSize) {
            this.softItem.installInfo.dlInfo.completedSize = dlInfo.completedSize;
        }
        if (dlInfo.totalSize) {
            this.softItem.installInfo.dlInfo.totalSize = dlInfo.totalSize;
        }
        if (dlInfo.percent) {
            this.softItem.installInfo.dlInfo.percent = dlInfo.percent;
        }
        if (dlInfo.perSecond) {
            this.softItem.installInfo.dlInfo.perSecond = dlInfo.perSecond;
        }
    }

    async install() {
        this.resetDownloadInfo();
        try {
            await this.download();
        } catch (error) {
            this.changeStatus(SoftwareInstallStatus.DownloadError);
            let errMsg = error.message ? error.message : '未知错误';
            throw new Error(`下载失败，${errMsg}`);
        }

        if (is.dev()) console.log('判断是否下载完成')

        if (this.softItem.installInfo.status !== SoftwareInstallStatus.Downloaded) {
            this.changeStatus(SoftwareInstallStatus.Abort);
            return;
        }

        if (is.dev()) console.log('开始解压...')

        try {
            await this.zipExtract();
            this.changeStatus(SoftwareInstallStatus.Extracted);
        } catch (error) {
            this.changeStatus(SoftwareInstallStatus.ExtractError);
            let errMsg = error.message ? error.message : '未知错误';
            throw new Error(`解压失败，${errMsg}`);
        }
        this.changeStatus(SoftwareInstallStatus.Finish);
    }

    async download() {
        return await new Promise((resolve, reject) => {
            let corePath = App.getUserCorePath();
            let downloaderPath = path.join(corePath, 'aria2c');
            let downloadsPath = path.join(corePath, 'downloads');
            let args = [this.softItem.url, '--check-certificate=false', '--allow-overwrite=true', `--dir=${downloadsPath}`];

            let dlProcess = child_process.spawn(downloaderPath, args);
            this.changeStatus(SoftwareInstallStatus.Downloading);
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
                if (is.dev()) console.log(data)
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
                    this.changeStatus(SoftwareInstallStatus.Abort);
                    return resolve(true);
                }
                if (code === 0) {
                    this.changeStatus(SoftwareInstallStatus.Downloaded);
                    this.setDownloadInfo({percent: 100})
                    return resolve(true);
                }
                console.log('errMsg', this.errMsg)
                reject(new Error(this.errMsg));
            });

        });

    }

    changeStatus(status) {
        this.softItem.installInfo.status = status;
    }

    async zipExtract() {
        let softItem = this.softItem;
        softItem.DirName = 'test';
        let filePath = path.join(GetPath.getDownloadsPath(), `HandyControl.git.zip`);
        let typePath = Software.getTypePath(softItem.Type)
        this.changeStatus(SoftwareInstallStatus.Extracting);
        return await extract(filePath, {dir: typePath});
    }

}
