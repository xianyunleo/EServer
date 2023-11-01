import { devConsoleLog, isWindows } from '@/main/utils/utils'
import App from '@/main/App'
import path from 'path'
import { EnumSoftwareInstallStatus } from '@/shared/utils/enum'
import extract from 'extract-zip'
import Software from '@/main/core/software/Software'
import Database from '@/main/core/Database'
import { DOWNLOAD_URL } from '@/shared/utils/constant'
import Directory from '@/main/utils/Directory'
import SoftwareExtend from '@/main/core/software/SoftwareExtend'
import got from 'got'
import { pipeline } from 'stream/promises'
import fs from 'fs'
import Path from '@/main/utils/Path'
import File from '@/main/utils/File'
import GetPath from '@/shared/utils/GetPath'
import SoftwareInit from '@/main/core/software/SoftwareInit'
import { EventEmitter } from 'events'
import { mt, t } from '@/shared/utils/i18n'

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
        this.fileName = `${softItem.DirName}.zip`;
        this.filePath = Path.Join(this.getDownloadsPath(), this.fileName);
        this.tempFilePath = `${this.filePath}.dl`;
        this.dlAbortController = new AbortController();
    }

    async install() {
        if (!Directory.Exists(GetPath.getDownloadsDir())) {
            Directory.CreateDirectory(GetPath.getDownloadsDir());
        }

        if(File.Exists(this.tempFilePath)){
            File.Delete(this.tempFilePath);
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
                console.log(t('anErrorOccurredDuring', [t('download')]), errMsg)
                throw new Error(`${t('anErrorOccurredDuring', [t('download')])}，${mt('Network', 'ws', 'Error')}`)
            }
        }

        try {
            await this.zipExtract();
            this.changeStatus(EnumSoftwareInstallStatus.Extracted);
        } catch (error) {
            this.changeStatus(EnumSoftwareInstallStatus.ExtractError);
            let errMsg = error.message ?? '未知错误';
            throw new Error(`${t('anErrorOccurredDuring', [t('unzip')])}，${errMsg}`);
        }

        try {
            await this.configure();
        } catch (error) {
            let errMsg = error.message ?? '未知错误';
            throw new Error(`${t('anErrorOccurredDuring', [t('configure')])}，${errMsg}`);
        }

        this.changeStatus(EnumSoftwareInstallStatus.Finish);
    }

    async configure() {
        this.changeStatus(EnumSoftwareInstallStatus.Configuring);

        let dirName = this.softItem.DirName;
        if (dirName.match(/^mysql-[.\d]+$/)) {
            let version = SoftwareExtend.getMysqlVersion(dirName);
            await SoftwareInit.initMySQLConf(version);
            if (!Directory.Exists(GetPath.getMysqlDataDir(version))) {
                await Database.initMySQL(version);
            }
        } else if (dirName.match(/^php-[.\d]+$/)) {
            let version = SoftwareExtend.getPHPVersion(dirName);
           //配置文件某些配置可能是tmp作为目录，需要改成temp
            await SoftwareInit.initPHPConf(version);
            if (!isWindows) {
                await SoftwareInit.createPHPFpmConf(version)
            }
        }

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
        File.Move(this.tempFilePath, this.filePath);
        this.changeStatus(EnumSoftwareInstallStatus.Downloaded);
    }

    stopDownload() {
        this.dlAbortController.abort();
    }

    changeStatus(status) {
        this.installStatus = status;
        this.emit('installStatus', status);
    }

    async zipExtract() {
        let filePath = path.join(this.getDownloadsPath(), this.fileName);
        let typePath = Software.getTypePath(this.softItem.Type)

        this.changeStatus(EnumSoftwareInstallStatus.Extracting);
        return await extract(filePath, {dir: typePath});
    }

    /**
     * 卸载成功返回true，否则false
     * @param item
     * @returns {boolean}
     */
    static uninstall(item) {
        let path = Software.getPath(item);
        if (Directory.Exists(path)) {
            Directory.Delete(path, true);
        }
        return !Directory.Exists(path);
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
