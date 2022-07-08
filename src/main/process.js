import child_process from "child_process";
import is from "electron-is";
import * as iconv from "iconv-lite";

export async function execPromise(command) {
    return await new Promise(function (resolve, reject) {
        const encoding = "gbk";
        const bufferEncoding = is.windows() ? "binary" : "utf8";

        const options = {
            encoding: bufferEncoding
        }
        console.log(process.env.ComSpec)
        child_process.exec(command, options, (err, stdout, stderr) => {
            if (err) {
                if (is.windows()) {
                    let str = iconv.decode(Buffer.from(err.message, bufferEncoding), encoding)
                    err = new Error(str)
                }
                reject(err);
            } else if (stderr.lenght > 0) {
                reject(new Error(stderr.toString()));
            } else {
                resolve(stdout.toString());
            }
        });
    });
}
