import {getCorePath} from "@/main/app";
import child_process from "child_process";
import path from "path";


export default class Downloader {

    constructor(url) {
        this.url = url;
        this.completedLength = 0;
        this.totalLength = 0;
        this.percent = 0;
        this.perSecond = '0KB';
    }

    download() {
        let corePath = getCorePath();
        let downloaderPath = path.join(corePath, 'aria2c');
        let downloadsPath = path.join(corePath, 'downloads');
        let args = [this.url, '--check-certificate=false', `--dir=${downloadsPath}`];


        this.process = child_process.spawn(downloaderPath, args);
        console.log('--pid--',process.pid)
        const regx = /([\d.]+\w+)\/([\d.]+\w+)\((\d+)%\).+DL:([\d.]+\w+)/ ;
        this.process.stdout.on('data', (data) => {
            data= data.toString();
            console.log(data)
            let matches =data.match(regx)
            if(matches){
                this.completedLength = matches[1];
                this.totalLength = matches[2];
                this.percent = parseInt(matches[3]);
                this.perSecond = matches[4];
            }
        });

        // process.stderr.on('data', (data) => {
        //     console.error(`stderr: ${data}`);
        // });

        this.process.on('close', (code) => {
            if (code !== 0) { // && code !== 1 //杀死进程
                throw new Error(`下载失败，错误码 ${code}`);
            }
        });
    }

    exit() {
        //this.process.kill()在Proxy下有问题
        process.kill(this.process.pid,'SIGKILL')
    }
}
