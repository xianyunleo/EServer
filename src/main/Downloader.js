import {getCorePath} from "@/main/app";
import child_process from "child_process";
import path from "path";
import is from "electron-is";
import {DOWNLOAD_STATUS} from "@/main/constant";


export default class Downloader {
    url = '';
    completedSize = 0;
    totalSize = 0;
    percent = 0;
    perSecond = '0KB';

    errMsg = '';
    status = DOWNLOAD_STATUS.READY;
    constructor(url) {
        this.url = url;
    }

    async download() {
        let self = this;
        return await new Promise((resolve, reject) => {
            let corePath = getCorePath();
            let downloaderPath = path.join(corePath, 'aria2c');
            let downloadsPath = path.join(corePath, 'downloads');
            let args = [self.url, '--check-certificate=false', `--dir=${downloadsPath}`];

            self.process = child_process.spawn(downloaderPath, args);
            const progressRegx = /([\d.]+\w+)\/([\d.]+\w+)\((\d+)%\).+DL:([\d.]+\w+)/;
            const errRegx = /errorCode=\d+.+/g;
            self.process.stdout.on('data', (data) => {
                data = data.toString();
                if (is.dev()) {
                    console.log(data)
                }
                let matches = data.match(progressRegx)
                if (matches) {
                    self.completedSize = matches[1].replace('i', '');
                    self.totalSize = matches[2].replace('i', '');
                    self.percent = parseInt(matches[3]);
                    self.perSecond = matches[4].replace('i', '');
                } else {
                    let errMatches = data.match(errRegx)
                    if (errMatches && errMatches.length > 0) {
                        self.errMsg = errMatches.pop();
                    }
                }
            });

            self.process.on('close', (code) => {
                if (code == null || code === 1) { // code = 1，是被 process.kill(pid) 了
                    return;
                }
                if (code === 0) {
                    self.completed = true;
                }
                reject(new Error(self.errMsg));
            });
        });

    }

    stop() {
        //this.process.kill()//在Proxy下有问题
        process.kill(this.process.pid, 'SIGKILL')
    }
}
