import Path from "@/main/utils/Path";
import GetPath from "@/shared/utils/GetPath";
import child_process from "child_process";
import fs from "fs";
import Directory from "@/main/utils/Directory";
import fixPath from "fix-path";

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
    install() {
        fixPath();
        let extVersion = this.getExtVersion();
        let options = {detached: true, shell: true};
        let shFilePath = Path.Join(GetPath.getScriptDir(), `php/${this.extName}.sh`);
        fs.chmodSync(shFilePath,'0755');
        let phpExtDlDir = Path.Join(GetPath.getDownloadsDir(), 'phpExt');
        if(!Directory.Exists(phpExtDlDir)){
            Directory.CreateDirectory(phpExtDlDir);
        }
        let phpDir = GetPath.getPhpDir(this.phpVersion);
        let args = [phpExtDlDir, phpDir, extVersion];
        let childProcess = child_process.spawn(shFilePath, args, options);

        childProcess.stderr.on('data', (data) => {
            console.log('phpExt:stderr',data.toString())
            this.eventEmitter.emit('phpExt:stderr',data.toString())
        });

        childProcess.stdout.on('data', (data) => {
            console.log('phpExt:stdout',data.toString())
            this.eventEmitter.emit('phpExt:stdout',data.toString())
        });

        // eslint-disable-next-line no-unused-vars
        childProcess.on('exit', (code) => {

        });

        this.eventEmitter.on('phpExt:stop', () => {
            console.log('phpExt:stop----',)
            childProcess.kill(9);
            console.log('childProcess',childProcess.pid)
        })
    }

    stop(){
        console.log('Install stop')
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
        }
        return null;
    }

}
