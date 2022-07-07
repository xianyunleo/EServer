import child_process from "child_process";

export async function execPromise(command) {
    return await new Promise(function (resolve, reject) {
        child_process.exec(command, {
            maxBuffer: 1024 * 2000
        }, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            } else if (stderr.lenght > 0) {
                reject(new Error(stderr.toString()));
            } else {
                resolve(stdout.toString());
            }
        });
    });
}