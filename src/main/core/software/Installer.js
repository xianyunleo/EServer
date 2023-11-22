import { devConsoleLog, isWindows } from '@/main/utils/utils'
import App from '@/main/App'
import path from 'path'
import { EnumSoftwareInstallStatus } from '@/shared/utils/enum'
import Software from '@/main/core/software/Software'
import { DOWNLOAD_URL } from '@/shared/utils/constant'
import Directory from '@/main/utils/Directory'
import got from 'got'
import { pipeline } from 'stream/promises'
import fs from 'fs'
import Path from '@/main/utils/Path'
import FileUtil from '@/main/utils/FileUtil'
import GetPath from '@/shared/utils/GetPath'
import { EventEmitter } from 'events'
import { mt, t } from '@/shared/utils/i18n'
import CommonInstall from "@/main/core/software/CommonInstall";

export default class Installer extends EventEmitter {
    softItem;
    fileName;
    filePath; //下载文件路径
    tempFilePath; //临时下载文件路径
    installStatus;
    dlAbortController;
    /**
     *
     * @param softItem {SoftwareItem}
     */
    constructor(softItem) {
        super();
        this.softItem = softItem;
        this.fileName = this.getFileName();
        this.filePath = Path.Join(this.getDownloadsPath(), this.fileName);
        this.tempFilePath = `${this.filePath}.dl`;
        this.dlAbortController = new AbortController();
    }

    async install() {
        if (!Directory.Exists(GetPath.getDownloadsDir())) {
            Directory.CreateDirectory(GetPath.getDownloadsDir());
        }

        if(FileUtil.Exists(this.tempFilePath)){
            FileUtil.Delete(this.tempFilePath);
        }

        try {
            await this.download()
        } catch (error) {
            if (error.name === 'AbortError') {
                devConsoleLog('下载已取消！')
                return
            } else {
                this.changeStatus(EnumSoftwareInstallStatus.DownloadError)
                let errMsg = error.message ?? '未知错误'
                console.log(t('errorOccurredDuring', [t('download')]), errMsg)
                throw new Error(`${t('errorOccurredDuring', [t('download')])}，${mt('Network', 'ws', 'Error')}`)
            }
        }

        try {
            await this.extract();
            this.changeStatus(EnumSoftwareInstallStatus.Extracted);
        } catch (error) {
            this.changeStatus(EnumSoftwareInstallStatus.ExtractError);
            let errMsg = error.message ?? '未知错误';
            throw new Error(`${t('errorOccurredDuring', [t('uncompress')])}，${errMsg}`);
        }

        try {
            await this.configure();
        } catch (error) {
            let errMsg = error.message ?? '未知错误';
            throw new Error(`${t('errorOccurredDuring', [t('configure')])}，${errMsg}`);
        }

        this.changeStatus(EnumSoftwareInstallStatus.Finish);
    }

    async configure() {
        this.changeStatus(EnumSoftwareInstallStatus.Configuring);
        await CommonInstall.configure(this.softItem.DirName);
    }

    async download() {
        this.changeStatus(EnumSoftwareInstallStatus.Downloading);

        let url = this.getDownloadUrl();
        devConsoleLog('software url',url)
        let responseStream = got.stream(url);
        let writeStream = fs.createWriteStream(this.tempFilePath);

        responseStream.on('downloadProgress', progress => {
            this.emit('downloadProgress', progress)
        });

        await pipeline(responseStream, writeStream,{signal: this.dlAbortController.signal});
        FileUtil.Move(this.tempFilePath, this.filePath);
        this.changeStatus(EnumSoftwareInstallStatus.Downloaded);
    }

    stopDownload() {
        this.dlAbortController.abort();
    }

    changeStatus(status) {
        this.installStatus = status;
        this.emit('installStatus', status);
    }

    async extract() {
        this.changeStatus(EnumSoftwareInstallStatus.Extracting);
        const filePath = path.join(this.getDownloadsPath(), this.fileName);
        const dest = Software.getTypePath(this.softItem.Type);
        await CommonInstall.extract(filePath, dest);
    }

    /**
     * 卸载成功返回true，否则false
     * @param item
     * @returns {Promise<boolean>}
     */
    static async uninstall(item) {
        let path = Software.getPath(item);
        await Directory.Delete(path);
        return !Directory.Exists(path);
    }

    getFileName() {
        let ext
        if (this.softItem.RemoteFileExtension) {
            ext = this.softItem.RemoteFileExtension
        } else {
            if (this.softItem.IsCommonPlatform) {
                ext = '.zip'
            } else {
                ext = isWindows ? '.7z' : '.tar.xz'
            }
        }
        return `${this.softItem.DirName}${ext}`
    }

    getDownloadUrl() {
        let url = `${DOWNLOAD_URL}/software`
        if (this.softItem.IsCommonPlatform) {
            url = `${url}/common`;
        } else {
            if (isWindows) {
                url = `${url}/win`;
            } else {
                url = `${url}/mac_x64`;
            }
        }

        return `${url}/${this.fileName}`;
    }

    getDownloadsPath() {
        return path.join(App.getUserCoreDir(), 'downloads');
    }
}
