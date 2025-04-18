import path from 'path'
import Php from '@/main/services/php/Php'
import FileUtil from '@/main/utils/FileUtil'
import { isWindows } from '@/main/utils/utils'
import GetCorePath from '@/shared/utils/GetCorePath'

export default class Extension {
    static async getList(phpVersion) {
        const list = this.getSimpleList()

        const extDir = await Php.getExtensionDir(phpVersion)

        return await Promise.all(
            list.map(async (item) => {
                let isInstalled = await FileUtil.Exists(path.join(extDir, item.fileName))
                return { ...item, isInstalled }
            })
        )
    }

    static getSimpleList() {
        if (isWindows) {
            return this.getSimpleListForWindows()
        }

        return [
            {
                name: 'memcache',
                fileName: 'memcache.so'
            }, {
                name: 'redis',
                fileName: 'redis.so'
            }, {
                name: 'swoole',
                fileName: 'swoole.so'
            }, {
                name: 'mongodb',
                fileName: 'mongodb.so'
            }, {
                name: 'xdebug',
                fileName: 'xdebug.so',
                isZend: true
            }, {
                name: 'imagick',
                fileName: 'imagick.so',
                needX64Brew: true
            },{
                name: 'xlswriter',
                fileName: 'xlswriter.so'
            }
        ]
    }

    static isNeedX64Brew(extName) {
        return this.getSimpleList().find(item => item.nam === extName)?.needX64Brew
    }

    static getSimpleListForWindows() {
        return [
            {
                name: 'memcache',
                fileName: 'php_memcache.dll'
            }, {
                name: 'redis',
                fileName: 'php_redis.dll'
            }, {
                name: 'mongodb',
                fileName: 'php_mongodb.dll'
            }, {
                name: 'xdebug',
                fileName: 'php_xdebug.dll',
                isZend: true
            }, {
                name: 'xlswriter',
                fileName: 'php_xlswriter.dll'
            }
        ]
    }

    static getFileName(extName) {
        let list = this.getSimpleList()
        return list.find(v => v.name === extName)?.fileName
    }

    static getVersion(extName, phpVersion) {
        //目前EServer，扩展最低匹配php5.6
        if (isWindows) {
            return this.getVersionForWindows(extName, phpVersion)
        }

        phpVersion = Number(phpVersion)
        switch (extName) {
            case 'memcache':
                if (phpVersion <= 5.6) {
                    return '3.0.8'
                } else if (phpVersion <= 7.4) {
                    return '4.0.5.2'
                } else {
                    return '8.2'
                }
            case 'redis':
                if (phpVersion < 7.0) {
                    return '4.3.0'
                } else if (phpVersion < 7.2) {
                    return '5.3.7'
                } else {
                    return '6.1.0'
                }
            case 'swoole':
                if (phpVersion < 5.5) {
                    return '1.10.5'
                } else if (phpVersion < 7.0) {
                    return '2.2.0'
                } else if (phpVersion < 7.2) {
                    return '4.5.11'
                } else if (phpVersion < 8.0) {
                    return '4.8.13'
                } else if (phpVersion < 8.4) {
                    return '5.1.7'
                } else {
                    return '6.0.2'
                }
            case 'mongodb':
                if (phpVersion <= 7.1) {
                    return '1.7.5'
                } else if (phpVersion < 7.4) {
                    return '1.15.3'
                } else {
                    return '1.19.3'
                }
            case 'imagick':
                if (phpVersion <= 5.6) {
                    return '3.4.4'
                } else {
                    return '3.7.0'
                }
            case 'xdebug':
                if (phpVersion <= 5.6) {
                    return '2.5.5'
                } else if (phpVersion <= 7.4) {
                    return '2.9.8'
                } else {
                    return '3.4.2'
                }
            case 'xlswriter':
                if (phpVersion >= 7.0){
                    return '1.5.7'
                }
        }
        return null
    }

    //！！！每新增一个php版本，还需要在getVcStringVersion 方法里添加定义！！！
    static getVersionForWindows(extName, phpVersion) {
        //目前EServer，扩展最低匹配php5.6，Windows扩展版本按 https://downloads.php.net/~windows/pecl/releases/
        phpVersion = Number(phpVersion)
        switch (extName) {
            case 'memcache':
                if (phpVersion <= 5.6) {
                    return '3.0.8'
                } else if (phpVersion >= 7.0 && phpVersion <= 7.1) {
                    return null
                } else if (phpVersion >= 7.2 && phpVersion <= 7.4) { //todo 7.2的包改官方的 memcache扩展
                    return '4.0.5.2'
                } else if (phpVersion <= 8.3) {
                    return '8.2'
                } else {
                    return null
                }
            case 'redis':
                if (phpVersion <= 5.6) {
                    return '2.2.7'
                } else if (phpVersion <= 7.3) {
                    return '4.2.0'
                } else if (phpVersion <= 8.1) {
                    return '5.3.7'
                } else if (phpVersion <= 8.4) {
                    return '6.1.0'
                } else {
                    return null
                }
            case 'mongodb':
                if (phpVersion <= 7.2) {
                    return '1.4.4'
                } else if (phpVersion <= 7.3) {
                    return '1.10.0'
                } else if (phpVersion <= 8.1) {
                    return '1.13.0'
                } else if (phpVersion <= 8.3) {
                    return '1.19.4'
                } else {
                    return null
                }
            case 'xdebug':
                if (phpVersion <= 5.6) {
                    return '2.5.5'
                } else if (phpVersion <= 7.4) {
                    return '2.9.8'
                } else if (phpVersion <= 8.3) {
                    return '3.3.2'
                } else {
                    return null
                }
            case 'xlswriter':
                if (phpVersion == 5.6) {
                    return null
                }
                if (phpVersion == 7.0) {
                    return '1.2.3'
                } else if (phpVersion == 7.1) {
                    return '1.3.2'
                } else if (phpVersion <= 8.3) {
                    return '1.5.8'
                } else {
                    return null
                }
        }
        return null
    }

    /**
     *
     * @param extName  {string}
     * @returns {string}
     */
    static getInstallScriptPath(extName='') {
        if (isWindows) {
            return path.join(GetCorePath.getScriptDir(), `php/common.ps1`)
        } else {
            return path.join(GetCorePath.getScriptDir(), `php/${extName}.sh`)
        }
    }
}
