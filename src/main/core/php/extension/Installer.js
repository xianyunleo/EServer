import Path from "@/main/utils/Path";
import GetPath from "@/shared/utils/GetPath";
import child_process from "child_process";
import fs from "fs";
import Directory from "@/main/utils/Directory";
import fixPath from "fix-path";
import App from "@/main/App";
import Extension from "./Extension";
import OS from "@/main/core/OS";
import Php from "@/main/core/php/Php";

export default class Installer {
    extName; //扩展名
    phpVersion; //php版本。如8.0
    msg;
    errMsg;
    eventEmitter;
    constructor(extName,phpVersion,eventEmitter) {
        this.extName = extName;
        this.phpVersion = phpVersion;
        this.eventEmitter = eventEmitter;
    }

    /**
     *
     * @returns {string} command
     */
    install() {
        if (OS.isMacOS()) {
            fixPath();
        }

        let extVersion = Extension.getVersion(this.extName,this.phpVersion);
        if(!extVersion){
            return ;
        }
        let options = {shell: true};

        let scriptFilePath;
        let args;
        let phpExtDlDir = Path.Join(GetPath.getDownloadsDir(), 'phpExt');
        if(!Directory.Exists(phpExtDlDir)){
            Directory.CreateDirectory(phpExtDlDir);
        }
        let phpDir = GetPath.getPhpDir(this.phpVersion);


        if(OS.isWindows()){
            scriptFilePath = Path.Join(GetPath.getScriptDir(), `php/common.bat`);
            let extFileName = Extension.getFileName(this.extName);
            let phpExtDir = Php.getExtensionDir(this.phpVersion);
            let dlFileName = this.getDownloadFileName(extVersion);
            args = [phpExtDlDir, phpDir, extVersion, this.extName, extFileName, phpExtDir, dlFileName];
        }else {
            scriptFilePath = Path.Join(GetPath.getScriptDir(), `php/${this.extName}.sh`);
            fs.chmodSync(scriptFilePath,'0755');
            args = [phpExtDlDir, phpDir, extVersion];
        }


        let childProcess = child_process.spawn(scriptFilePath, args, options);

        childProcess.stderr.on('data', (data) => {
            if (App.isDev()) console.log('phpExt:stderr',data.toString())
            this.eventEmitter.emit('phpExt:stderr',data.toString())
        });

        childProcess.stdout.on('data', (data) => {
            if(App.isDev()) console.log('phpExt:stdout',data.toString())
            this.eventEmitter.emit('phpExt:stdout',data.toString())
        });

        childProcess.on('exit', (code,signal) => {
            this.eventEmitter.emit('phpExt:exit',code,signal)
        });

        this.eventEmitter.on('phpExt:stop', () => {
            childProcess.kill();
        })

        let command = `${scriptFilePath} ${args.join(' ')}`;
        if (App.isDev()) console.log("install command:\n", command);
        return command;
    }

    stop(){
        this.eventEmitter.emit('phpExt:stop');
    }

    getDownloadFileName(extVersion) {
        let vcVersion = this.getVcStringVersion();
        let name = `php_${this.extName}-${extVersion}-${this.phpVersion}-nts-${vcVersion}-x64.zip`;
        return name;
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
