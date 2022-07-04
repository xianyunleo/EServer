import {getCorePath} from "@/main/app";
import child_process from "child_process";
import path from "path";

export function download(url) {
    url = 'https://dl.phpenv.cn/release/phpEnv8.3.5-Setup.exe'

    let corePath = getCorePath();

    let dlPath = path.join(corePath, 'aria2c');
    let command = `${dlPath} ${url} --check-certificate=false`;
    child_process.exec(command, (r) => {
        console.log(r)
    })
}
