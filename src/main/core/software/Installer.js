import { devConsoleLog, isWindows } from '@/main/utils/utils'
import { EnumSoftwareInstallStatus } from '@/shared/utils/enum'
import Software from '@/main/core/software/Software'
import { DOWNLOAD_URL } from '@/shared/utils/constant'
import DirUtil from '@/main/utils/DirUtil'
import path from 'path'
import FileUtil from '@/main/utils/FileUtil'
import { EventEmitter } from 'events'
import { mt, t } from '@/renderer/utils/i18n'
import CommonInstall from "@/main/core/software/CommonInstall";
import Downloader from 'electron-dl-downloader'
import GetUserPath from '@/shared/utils/GetUserPath'

export default class Installer extends EventEmitter {
    name;
    softItem;
    fileName;
    filePath; //下载文件路径
    tempFilePath; //临时下载文件路径
    status;
    downloader;

    static DownloadItemMap = new Map()

    constructor(name) {
        super()
        this.name = name
    }

    /**
     *
     * @returns {Promise<DownloadItem>}
     */
    async install() {
        this.softItem = (await Software.getList()).find(item => item.Name === this.name)
        this.fileName = this.getFileName()
        this.filePath = path.join(this.getDownloadsPath(), this.fileName)
        this.tempFilePath = `${this.filePath}.dl`
        this.downloader = new Downloader({url:this.getDownloadUrl(), filePath:this.tempFilePath})

        if (!await DirUtil.Exists(GetUserPath.getDownloadsDir())) await DirUtil.Create(GetUserPath.getDownloadsDir())
        if (await FileUtil.Exists(this.filePath)) await FileUtil.Delete(this.filePath)
        if (await FileUtil.Exists(this.tempFilePath)) await FileUtil.Delete(this.tempFilePath)

        try {
            return await this._download()
        } catch (error) {
            if (error.name === 'AbortError') {
                devConsoleLog('下载已取消！')
            } else {
                this._changeStatus(EnumSoftwareInstallStatus.DownloadError)
                throw new Error(`${t('errorOccurredDuring', [t('download')])}，${mt('Network', 'ws', 'Error')}\n${error.message}`)
            }
        }

    }

    async whenDone(){
        try {
            const dlState = await this.downloader.whenDone()
            if (dlState !== Downloader.STATES.completed) return
            await this._moveDownloadedFile()
        } catch (error) {
            throw new Error(`${t('errorOccurredDuring', [t('download')])}，Move file failure\n${error.message}`)
        }

        try {
            await this._extract();
            this._changeStatus(EnumSoftwareInstallStatus.Extracted);
        } catch (error) {
            this._changeStatus(EnumSoftwareInstallStatus.ExtractError);
            throw new Error(`${t('errorOccurredDuring', [t('uncompress')])}，${error.message}`);
        }

        try {
            await this._configure();
        } catch (error) {
            throw new Error(`${t('errorOccurredDuring', [t('configure')])}，${error.message}`);
        }

        this._changeStatus(EnumSoftwareInstallStatus.Finish);
    }

    async _configure() {
        this._changeStatus(EnumSoftwareInstallStatus.Configuring);
        await CommonInstall.configure(this.softItem.DirName);
    }

    /**
     *
     * @returns {Promise<DownloadItem>}
     */
    async _download() {
        this._changeStatus(EnumSoftwareInstallStatus.Downloading)
        const downloadItem = await this.downloader.download()
        Installer.DownloadItemMap.set(this.name, downloadItem)
        return downloadItem
    }

    async _moveDownloadedFile() {
         await FileUtil.Move(this.tempFilePath, this.filePath);
         this._changeStatus(EnumSoftwareInstallStatus.Downloaded);
    }

    stopDownload() {
        this.dlAbortController.abort();
    }

    _changeStatus(status) {
        this.status = status;
        this.emit('status', status);
    }

    async _extract() {
        this._changeStatus(EnumSoftwareInstallStatus.Extracting);
        const filePath = path.join(this.getDownloadsPath(), this.fileName);
        const dest = Software.getTypePath(this.softItem.Type);
        await CommonInstall.extract(filePath, dest);
    }

    /**
     * 卸载成功返回true，否则false
     * @param name
     * @returns {Promise<boolean>}
     */
    static async uninstall(name) {
        const path = Software.getPath(await Software.findItem(name))
        await DirUtil.Delete(path)
        return !await DirUtil.Exists(path)
    }

    getFileName() {
        const ext = this.softItem.RemoteArchiveExt ?? '.zip'
        return `${this.softItem.DirName}${ext}`
    }

    getDownloadUrl() {
        let url = `${DOWNLOAD_URL}/software`
        if (this.softItem.RemoteIsCommonPlatform) {
            url = `${url}/common`;
        } else {
            if (isWindows) {
                url = `${url}/win`;
            } else {
                url = `${url}/v3_mac_x64`;
            }
        }

        return `${url}/${this.fileName}`;
    }

    getDownloadsPath() {
        return path.join(GetUserPath.getDir(), 'downloads');
    }
}
