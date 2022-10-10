import App from "@/main/App";
import path from "path";
import child_process from "child_process";
import {EnumSoftwareInstallStatus} from "@/shared/enum";
import extract from "extract-zip";
import Software from "@/main/core/software/Software";
import Database from "@/main/core/Database";
import is from "electron-is";
import {DOWNLOAD_URL} from "@/shared/constant";
import Directory from "@/main/utils/Directory";

export default class Installer {
    item;
    fileName;
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
        //todo配置中，配置文件
        try {
            // eslint-disable-next-line no-constant-condition
            if ('mysql'===1) {
                Database.InitMySQL();
            }
        } catch (error) {
            let errMsg = error.message ?? '未知错误';
            throw new Error(`安装出错，${errMsg}`);
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
            let downloaderPath = this.getDownloaderPath();
            let downloadsPath = this.getDownloadsPath();
            let stdbufPath = this.getStdbufPath();
            let url = this.getDownloadUrl();
            if (App.isDev()) console.log('downloadUrl',url)

            let command = `${downloaderPath} ${url} --dir=${downloadsPath} --check-certificate=false --allow-overwrite=true --remove-control-file=true`;

            if (!is.windows()) {
                command = `${stdbufPath} -o0 ${command}`;
            }

            if (App.isDev()) console.log('command',command)

            let dlProcess = child_process.exec(command);
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
                if (App.isDev()) console.log('errCode', code)
                if (this.downloadSignal) {
                    this.downloadSignal.removeEventListener('abort', abortDownload);
                }
                if (code == null || code === 7) {
                    this.changeStatus(EnumSoftwareInstallStatus.Abort);
                    return resolve(true);
                }
                if (code === 0) {
                    this.changeStatus(EnumSoftwareInstallStatus.Downloaded);
                    this.setDownloadInfo({percent: 100})
                    return resolve(true);
                }
                if (App.isDev()) console.log('errMsg', this.errMsg)
                reject(new Error(this.errMsg));
            });

        });

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

     getDownloaderPath() {
        return path.join(App.getCorePath(), 'aria2c');
    }

    getStdbufPath() {
        return path.join(App.getCorePath(), 'stdbuf');
    }

    static uninstall(item) {
        let path = Software.getPath(item);
        Directory.Delete(path);
    }
}
