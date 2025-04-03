import { debugLog, isWindows } from '@/main/utils/utils'
import { EnumChildAppInstallStatus } from '@/shared/utils/enum'
import ChildApp from '@/main/services/childApp/ChildApp'
import { DOWNLOAD_URL } from '@/shared/utils/constant'
import DirUtil from '@/main/utils/DirUtil'
import path from 'path'
import FileUtil from '@/main/utils/FileUtil'
import { EventEmitter } from 'events'
import { mt, t } from '@/renderer/utils/i18n'
import CommonInstall from "@/main/services/childApp/CommonInstall";
import Downloader from 'electron-dl-downloader'
import GetDataPath from '@/shared/utils/GetDataPath'

export default class Installer extends EventEmitter {
    name;
    appItem;
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
        this.appItem = (await ChildApp.getList()).find(item => item.Name === this.name)
        this.fileName = this.getFileName()
        this.filePath = path.join(this.getDownloadsPath(), this.fileName)
        this.tempFilePath = `${this.filePath}.dl`
        this.downloader = new Downloader({url:this.getDownloadUrl(), filePath:this.tempFilePath})

        if (!await DirUtil.Exists(GetDataPath.getDownloadsDir())) await DirUtil.Create(GetDataPath.getDownloadsDir())
        if (await FileUtil.Exists(this.filePath)) await FileUtil.Delete(this.filePath)
        if (await FileUtil.Exists(this.tempFilePath)) await FileUtil.Delete(this.tempFilePath)

        try {
            return await this._download()
        } catch (error) {
            if (error.name === 'AbortError') {
                debugLog('下载已取消！')
            } else {
                this._changeStatus(EnumChildAppInstallStatus.DownloadError)
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
            this._changeStatus(EnumChildAppInstallStatus.Extracted);
        } catch (error) {
            this._changeStatus(EnumChildAppInstallStatus.ExtractError);
            throw new Error(`${t('errorOccurredDuring', [t('uncompress')])}，${error.message}`);
        }

        try {
            await this._configure();
        } catch (error) {
            throw new Error(`${t('errorOccurredDuring', [t('configure')])}，${error.message}`);
        }

        this._changeStatus(EnumChildAppInstallStatus.Finish);
    }

    async _configure() {
        this._changeStatus(EnumChildAppInstallStatus.Configuring);
        await CommonInstall.configure(this.appItem);
    }

    /**
     *
     * @returns {Promise<DownloadItem>}
     */
    async _download() {
        this._changeStatus(EnumChildAppInstallStatus.Downloading)
        const downloadItem = await this.downloader.download()
        Installer.DownloadItemMap.set(this.name, downloadItem)
        return downloadItem
    }

    async _moveDownloadedFile() {
         await FileUtil.Move(this.tempFilePath, this.filePath);
         this._changeStatus(EnumChildAppInstallStatus.Downloaded);
    }

    stopDownload() {
        this.dlAbortController.abort();
    }

    _changeStatus(status) {
        this.status = status;
        this.emit('status', status);
    }

    async _extract() {
        this._changeStatus(EnumChildAppInstallStatus.Extracting);
        const filePath = path.join(this.getDownloadsPath(), this.fileName);
        const dest = ChildApp.getTypeDir(this.appItem.Type);
        await CommonInstall.extract(filePath, dest);
    }

    /**
     * 卸载成功返回true，否则false
     * @param name
     * @returns {Promise<boolean>}
     */
    static async uninstall(name) {
        const path = ChildApp.getDir(await ChildApp.getItem(name))
        await DirUtil.Delete(path)
        return !await DirUtil.Exists(path)
    }

    getFileName() {
        const ext = this.appItem.RemoteArchiveExt ?? '.zip'
        return `${this.appItem.DirName}${ext}`
    }

    getDownloadUrl() {
        let url = `${DOWNLOAD_URL}/childApp`
        if (this.appItem.RemoteIsCommonPlatform) {
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
        return path.join(GetDataPath.getDir(), 'downloads');
    }
}
