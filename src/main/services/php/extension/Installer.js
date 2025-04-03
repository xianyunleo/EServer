import { isDev, isMacOS, isWindows } from '@/main/utils/utils'
import path from 'path'
import GetDataPath from '@/shared/utils/GetDataPath'
import child_process from 'child_process'
import fsPromises from 'fs/promises'
import DirUtil from '@/main/utils/DirUtil'
import fixPath from 'fix-path'
import Extension from './Extension'
import Php from '@/main/services/php/Php'

export default class Installer {
    extName; //扩展名
    extVersion
    phpVersion; //php版本。如8.0
    msg;
    errMsg;
    eventEmitter;
    constructor(extName,extVersion,phpVersion,eventEmitter) {
        this.extName = extName;
        this.extVersion = extVersion;
        this.phpVersion = phpVersion;
        this.eventEmitter = eventEmitter;
    }

    /**
     *
     * @returns {Promise<string>} command
     */
    async install() {
        if (isMacOS) {
            fixPath();
        }

        let commandStr;
        let phpExtDlDir = path.join(GetDataPath.getDownloadsDir(), 'phpExt');
        if (!await DirUtil.Exists(phpExtDlDir)) {
            await DirUtil.Create(phpExtDlDir);
        }
        let phpDir = GetDataPath.getPhpDir(this.phpVersion);

        const scriptPath = Extension.getInstallScriptPath(this.extName);
        if (isWindows) {
            let extFileName = Extension.getFileName(this.extName);
            let phpExtDir = await Php.getExtensionDir(this.phpVersion);
            let dlFileName = this.getDownloadFileName();
            commandStr = ` powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}"`;
            commandStr += ` ${phpExtDlDir} ${phpDir} ${this.extVersion} ${this.extName} ${extFileName} ${phpExtDir} ${dlFileName}`;
        } else {
            await fsPromises.chmod(scriptPath, 0o755);
            commandStr = `${scriptPath} ${phpExtDlDir} ${phpDir} ${this.extVersion}`;
        }

        let childProcess = child_process.exec(commandStr);

        childProcess.stderr.on('data', (data) => {
            this.eventEmitter.emit('phpExt:stderr', data.toString())
        });

        childProcess.stdout.on('data', (data) => {
            this.eventEmitter.emit('phpExt:stdout', data.toString())
        });

        childProcess.on('exit', (code, signal) => {
            this.eventEmitter.emit('phpExt:exit', code, signal)
        });

        this.eventEmitter.on('phpExt:stop', () => {
            childProcess.kill();
        })
        return commandStr;
    }

    stop(){
        this.eventEmitter.emit('phpExt:stop');
    }

    getDownloadFileName() {
        let vcVersion = this.getVcStringVersion();
        return `php_${this.extName}-${this.extVersion}-${this.phpVersion}-nts-${vcVersion}-x64.zip`;
    }

    getVcStringVersion() {
        switch (this.phpVersion) {
            case '8.4':
                return 'vs17';
            case '8.3':
            case '8.2':
            case '8.1':
            case '8.0':
                return 'vs16';
            case '7.4':
            case '7.3':
            case '7.2':
                return 'vc15';
            case '7.1':
            case '7.0':
                return 'vc14';
            case '5.6':
                return 'vc11';
        }
    }

}
