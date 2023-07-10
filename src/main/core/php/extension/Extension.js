import Path from "@/main/utils/Path";
import Php from "@/main/core/php/Php";
import File from "@/main/utils/File";

export default class Extension {
     static async getList(phpVersion) {
        let list = [{
            name: 'redis',
            extFileName: 'redis.so'
        }, {
            name: 'swoole',
            extFileName: 'swoole.so'
        }, {
            name: 'mongodb',
            extFileName: 'mongodb.so'
        },
        ];

        let extDir = Php.getExtensionDir(phpVersion);

        let newList = await Promise.all(
            list.map(async item => {
                let isInstalled = File.Exists(Path.Join(extDir,item.extFileName));
                return Object.assign({isInstalled},item);
            })
        );

        return newList;
    }
}
