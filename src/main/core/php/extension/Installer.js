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
        this.phpVersion = Number(phpVersion);
        this.eventEmitter = eventEmitter;
    }

    /**
     *
     * @returns {string} command
     */
    install() {
        fixPath();
        let extVersion = this.getExtVersion();
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
            let phpExtDir = Php.getExtensionDir(this.phpVersion)
            args = [phpExtDlDir, phpDir, extVersion, this.extName, extFileName ,phpExtDir];
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
        return command;
    }

    stop(){
        this.eventEmitter.emit('phpExt:stop');
    }

    getExtVersion() {
        switch (this.extName) {
            case 'redis':
                return this.phpVersion < 7.0 ? '4.3.0' : '5.3.7';
            case 'swoole':
                if (this.phpVersion < 5.5) {
                    return '1.10.5';
                } else if (this.phpVersion < 7.0) {
                    return '2.2.0';
                } else if (this.phpVersion < 7.2) {
                    return '4.5.11';
                } else if (this.phpVersion < 8.0) {
                    return '4.8.11';
                } else {
                    return '5.0.0';
                }
            case 'mongodb':
                if (this.phpVersion <= 7.1) {
                    return '1.7.5';
                } else {
                    return '1.15.3';
                }
        }
        return null;
    }

    getExtVersionByWindows() {
        switch (this.extName) {
            case 'redis':
                if (this.phpVersion <= 5.6) {
                    return '2.2.7';
                } else if (this.phpVersion <= 7.3) {
                    return '4.2.0';
                } else if (this.phpVersion <= 8.1) {
                    return '5.3.7';
                }
            case 'mongodb':
                if (this.phpVersion <= 7.2) {
                    return '1.4.4';
                } else if (this.phpVersion <= 7.3) {
                    return '1.10.0';
                } else if (this.phpVersion <= 8.1) {
                    return '1.13.0';
                }
        }
        return null;
    }

}
