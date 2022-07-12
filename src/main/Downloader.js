import {getCorePath} from "@/main/app";
import child_process from "child_process";
import path from "path";


export default class Downloader {
    constructor(url) {
        this.url = url;
    }

    download() {
        let corePath = getCorePath();
        let downloaderPath = path.join(corePath, 'aria2c');
        let downloadsPath = path.join(corePath, 'downloads');
        let args = [this.url, '--check-certificate=false', `--dir=${downloadsPath}`];

        this.process = child_process.spawn(downloaderPath, args);
        this.process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        // process.stderr.on('data', (data) => {
        //     console.error(`stderr: ${data}`);
        // });

        this.process.on('close', (code) => {
            if (code !== 0) {
                throw new Error(`下载失败，错误码 ${code}`);
            }
        });
    }

    exit() {
        this.process.kill();
    }
}
