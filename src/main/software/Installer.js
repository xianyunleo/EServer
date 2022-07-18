import fs from 'fs'
import {getCorePath} from "@/main/app";
import path from "path";
import {SOFTWARE_INSTALL_STATUS} from "@/main/constant";
import child_process from "child_process";
import is from "electron-is";


export default class Installer {
    dlInfo = {};
    errMsg = '';
    status = SOFTWARE_INSTALL_STATUS.READY;
    constructor(softItem) {
        this.softItem = softItem;
        this.softItem.url = 'https://dl-cdn.phpenv.cn/release/test.zip';
    }

    resetDownloadInfo(){
        this.dlInfo = {
            completedSize: 0,
            totalSize: 0,
            percent: 0,
            perSecond: '0KB',
        }
    }

    async install(){
        this.resetDownloadInfo();
        try{
            await this.download();
        }catch (error) {
            throw new Error(`下载失败，${error.message}`);
        }
        try{
            await this.zipExtract();
        }catch (error) {
            throw new Error(`解压失败，${error.message}`);
        }
    }

    async download() {
        //类的this和Promise无法在Promise方法里调用？todo再检查
        //let self = this;
        this.status = SOFTWARE_INSTALL_STATUS.DOWNLOADING;
        return await new Promise((resolve, reject) => {
            console.log('this',this.status)
            let corePath = getCorePath();
            let downloaderPath = path.join(corePath, 'aria2c');
            let downloadsPath = path.join(corePath, 'downloads');
            let args = [this.softItem.url, '--check-certificate=false', `--dir=${downloadsPath}`];

            this.dlProcess = child_process.spawn(downloaderPath, args);
            const progressRegx = /([\d.]+\w+)\/([\d.]+\w+)\((\d+)%\).+DL:([\d.]+\w+)/;
            const errRegx = /errorCode=\d+.+/g;
            this.dlProcess.stdout.on('data', (data) => {
                data = data.toString();
                if (is.dev()) {
                    console.log(data)
                }
                let matches = data.match(progressRegx)
                if (matches) {
                    this.dlInfo.completedSize = matches[1].replace('i', '');
                    this.dlInfo.totalSize = matches[2].replace('i', '');
                    this.dlInfo.percent = parseInt(matches[3]);
                    this.dlInfo.perSecond = matches[4].replace('i', '');
                } else {
                    let errMatches = data.match(errRegx)
                    if (errMatches && errMatches.length > 0) {
                        this.errMsg = errMatches.pop();
                    }
                }
            });

            this.dlProcess.on('close', (code) => {
                if (code == null || code === 1) { // code = 1，是被 process.kill(pid) 了
                    return;
                }
                if (code === 0) {
                    this.status = SOFTWARE_INSTALL_STATUS.DOWNLOADED;
                }
                reject(new Error(this.errMsg));
            });
        });

    }

    async zipExtract(){
        let softItem = this.softItem;
        let filePath  = path.join(this.getDownloadsPath(), `${softItem.DirName}.zip`);
        console.log(filePath)
    }

    stopDownload() {
        //this.dlProcess.kill()//在Proxy下有问题
        process.kill(this.dlProcess.pid, 'SIGKILL')
    }

    static getList(type) {
        let corePath = getCorePath();
        let softPath = path.join(corePath, '/config/software');
        let softConfigPath = path.join(softPath, 'software.json');
        let softIconPath = path.join(softPath, '/icon');
        let json = fs.readFileSync(softConfigPath);
        let list = JSON.parse(json);

        let newList =  [];
        for (const item of list) {
            if (type && type !== item.Type) {
                continue;
            }
            let newItem = item;
            newItem.Icon = path.join(softIconPath, item.Icon);
            newList.push(newItem);
        }
        return newList;
    }


}
