import Path from '@/main/utils/Path'
import Php from '@/main/core/php/Php'
import FileUtil from '@/main/utils/FileUtil'
import { isWindows } from '@/main/utils/utils'
import GetPath from '@/shared/utils/GetPath'

export default class Extension {
    static async getList(phpVersion) {
        let list = this.getSimpleList()

        let extDir = await Php.getExtensionDir(phpVersion)

        let newList = await Promise.all(
            list.map(async item => {
                let isInstalled = await FileUtil.Exists(Path.Join(extDir, item.extFileName))
                return Object.assign({ isInstalled }, item)
            })
        )

        return newList
    }

    static getSimpleList() {
        if (isWindows) {
            return this.getSimpleListForWindows()
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
                extFileName: 'swoole.so'
            }, {
                name: 'mongodb',
                extFileName: 'mongodb.so'
            }, {
                name: 'xdebug',
                extFileName: 'xdebug.so'
            }, {
                name: 'imagick',
                extFileName: 'imagick.so',
                needX64Brew: true
            }
        ]
    }

    static isNeedX64Brew(extName) {
        return this.getSimpleList().find(item => item.nam == extName)?.needX64Brew
    }

    static getSimpleListForWindows() {
        return [
            {
                name: 'memcache',
                extFileName: 'php_memcache.dll'
            }, {
                name: 'redis',
                extFileName: 'php_redis.dll'
            }, {
                name: 'mongodb',
                extFileName: 'php_mongodb.dll'
            }, {
                name: 'xdebug',
                extFileName: 'php_xdebug.dll'
            }
        ]
    }

    static getFileName(extName) {
        let list = this.getSimpleList()
        return list.find(v => v.name == extName)?.extFileName
    }

    static getVersion(extName, phpVersion) {
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
                    return '6.0.2'
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
                } else {
                    return '5.1.3'
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
                    return '3.3.2'
                }
        }
        return null
    }

    static getVersionForWindows(extName, phpVersion) {
        phpVersion = Number(phpVersion)
        switch (extName) {
            case 'memcache':
                if (phpVersion <= 5.6) {
                    return '3.0.8'
                } else if (phpVersion >= 7.2 && phpVersion <= 7.4) {
                    return '4.0.5.2'
                } else {
                    return '8.2'
                }
            case 'redis':
                if (phpVersion <= 5.6) {
                    return '2.2.7'
                } else if (phpVersion <= 7.3) {
                    return '4.2.0'
                } else if (phpVersion <= 8.1) {
                    return '5.3.7'
                } else {
                    return '6.0.2'
                }
            case 'mongodb':
                if (phpVersion <= 7.2) {
                    return '1.4.4'
                } else if (phpVersion <= 7.3) {
                    return '1.10.0'
                } else if (phpVersion <= 8.1) {
                    return '1.13.0'
                } else {
                    return '1.19.3'
                }
            case 'xdebug':
                if (phpVersion <= 5.6) {
                    return '2.5.5'
                } else if (phpVersion <= 7.4) {
                    return '2.9.8'
                } else {
                    return '3.3.2'
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
            return Path.Join(GetPath.getScriptDir(), `php/common.ps1`)
        } else {
            return Path.Join(GetPath.getScriptDir(), `php/${extName}.sh`)
        }
    }
}
