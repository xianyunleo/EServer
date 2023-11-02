import _7z from "7zip-min-win-asar-support";

export default class Extract {
    static async extract7z(path, dest) {
        return new Promise(function(resolve, reject) {
            _7z.unpack(path, dest, function(err) {
                err ? reject(err) : resolve(true);
            });
        });
    }
}
