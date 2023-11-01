import { isDev, isMacOS, isWindows } from '@/main/utils/utils'
import Path from '@/main/utils/Path'
import GetPath from '@/shared/utils/GetPath'
import child_process from 'child_process'
import fs from 'fs'
import Directory from '@/main/utils/Directory'
import fixPath from 'fix-path'
import Extension from './Extension'
import Php from '@/main/core/php/Php'

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
     * @returns {string} command
     */
    install() {
        if (isMacOS) {
            fixPath();
        }

        let commandStr;
        let phpExtDlDir = Path.Join(GetPath.getDownloadsDir(), 'phpExt');
        if(!Directory.Exists(phpExtDlDir)){
            Directory.CreateDirectory(phpExtDlDir);
        }
        let phpDir = GetPath.getPhpDir(this.phpVersion);

        if (isWindows) {
            let scriptFilePath = Path.Join(GetPath.getScriptDir(), `php/common.ps1`);
            let extFileName = Extension.getFileName(this.extName);
            let phpExtDir = Php.getExtensionDir(this.phpVersion);
            let dlFileName = this.getDownloadFileName();
            commandStr = ` powershell.exe -ExecutionPolicy Bypass -File "${scriptFilePath}"`;
            commandStr += ` ${phpExtDlDir} ${phpDir} ${this.extVersion} ${this.extName} ${extFileName} ${phpExtDir} ${dlFileName}`;
        } else {
            let scriptFilePath = Path.Join(GetPath.getScriptDir(), `php/${this.extName}.sh`);
            fs.chmodSync(scriptFilePath, '0755');
            commandStr = `${scriptFilePath} ${phpExtDlDir} ${phpDir} ${this.extVersion}`;
        }

        let childProcess = child_process.exec(commandStr);

        childProcess.stderr.on('data', (data) => {
            if (isDev) console.log('phpExt:stderr',data.toString())
            this.eventEmitter.emit('phpExt:stderr',data.toString())
        });

        childProcess.stdout.on('data', (data) => {
            if(isDev) console.log('phpExt:stdout',data.toString())
            this.eventEmitter.emit('phpExt:stdout',data.toString())
        });

        childProcess.on('exit', (code,signal) => {
            this.eventEmitter.emit('phpExt:exit',code,signal)
        });

        this.eventEmitter.on('phpExt:stop', () => {
            childProcess.kill();
        })

        if (isDev) console.log("install command:\n", commandStr);
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
