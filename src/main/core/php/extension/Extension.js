import Path from "@/main/utils/Path";
import Php from "@/main/core/php/Php";
import File from "@/main/utils/File";
import OS from "@/main/core/OS";

export default class Extension {
     static async getList(phpVersion) {
        let list = this.getSimpleList();

        let extDir = Php.getExtensionDir(phpVersion);

        let newList = await Promise.all(
            list.map(async item => {
                let isInstalled = File.Exists(Path.Join(extDir,item.extFileName));
                return Object.assign({isInstalled},item);
            })
        );

        return newList;
    }

    static getSimpleList(){
        if (OS.isWindows()) {
            return this.getSimpleListForWindows();
        }

        return [
            {
                name: 'memcache',
                extFileName: 'memcache.so'
            }, {
                name: 'redis',
                extFileName: 'redis.so'
            }, {
                name: 'swoole',
                extFileName: 'swoole.so',
            }, {
                name: 'mongodb',
                extFileName: 'mongodb.so'
            },{
                name: 'xdebug',
                extFileName: 'xdebug.so'
            },{
                name: 'imagick',
                extFileName: 'imagick.so',
                needX64Brew: true,
            },
        ];
    }

    static isNeedX64Brew(extName) {
        return this.getSimpleList().find(item => item.nam == extName)?.needX64Brew;
    }

    static isInstalledX64Brew() {
        return File.Exists('/usr/local/homebrew/bin/brew');
    }

    static getSimpleListForWindows(){
        return [
            {
                name: 'memcache',
                extFileName: 'php_memcache.dll'
            },{
                name: 'redis',
                extFileName: 'php_redis.dll'
            }, {
                name: 'mongodb',
                extFileName: 'php_mongodb.dll'
            },{
                name: 'xdebug',
                extFileName: 'php_xdebug.dll'
            },
        ];
    }

    static getFileName(extName) {
        let list = this.getSimpleList();
        return list.find(v => v.name == extName)?.extFileName;
    }

    static getVersion(extName, phpVersion) {
        if (OS.isWindows()) {
            return this.getVersionForWindows(extName, phpVersion);
        }

        phpVersion = Number(phpVersion);
        switch (extName) {
            case 'memcache':
                if (phpVersion <= 5.6) {
                    return '3.0.8';
                } else if (phpVersion <= 7.4) {
                    return '4.0.5.2';
                } else {
                    return '8.2';
                }
            case 'redis':
                return phpVersion < 7.0 ? '4.3.0' : '5.3.7';
            case 'swoole':
                if (phpVersion < 5.5) {
                    return '1.10.5';
                } else if (phpVersion < 7.0) {
                    return '2.2.0';
                } else if (phpVersion < 7.2) {
                    return '4.5.11';
                } else if (phpVersion < 8.0) {
                    return '4.8.11';
                } else {
                    return '5.0.0';
                }
            case 'mongodb':
                if (phpVersion <= 7.1) {
                    return '1.7.5';
                } else {
                    return '1.15.3';
                }
            case 'imagick':
                if (phpVersion <= 5.6) {
                    return '3.4.4';
                }  else {
                    return '3.7.0';
                }
            case 'xdebug':
                if (phpVersion <= 5.6) {
                    return '2.5.5';
                } else if (phpVersion <= 7.4) {
                    return '2.9.8';
                }  else {
                    return '3.2.1';
                }
        }
        return null;
    }

    static getVersionForWindows(extName, phpVersion) {
        phpVersion = Number(phpVersion);
        switch (extName) {
            case 'memcache':
                if (phpVersion <= 5.6) {
                    return '3.0.8';
                } else if (phpVersion >= 7.2 && phpVersion <= 7.4) {
                    return '4.0.5.2';
                } else {
                    return null;
                }
            case 'redis':
                if (phpVersion <= 5.6) {
                    return '2.2.7';
                } else if (phpVersion <= 7.3) {
                    return '4.2.0';
                } else if (phpVersion <= 8.1) {
                    return '5.3.7';
                } else {
                    return null;
                }
            case 'mongodb':
                if (phpVersion <= 7.2) {
                    return '1.4.4';
                } else if (phpVersion <= 7.3) {
                    return '1.10.0';
                } else if (phpVersion <= 8.1) {
                    return '1.13.0';
                } else {
                    return null;
                }
            case 'xdebug':
                if (phpVersion <= 5.6) {
                    return '2.5.5';
                } else if (phpVersion <= 7.4) {
                    return '2.9.8';
                } else if (phpVersion <= 8.1) {
                    return '3.1.3';
                } else {
                    return null;
                }

        }
        return null;
    }
}
