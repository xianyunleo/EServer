import ChildAppExtend from "@/main/services/childApp/ChildAppExtend";
import ChildAppInit from "@/main/services/childApp/ChildAppInit";
import DirUtil from "@/main/utils/DirUtil";
import { extractTarXz, extractZip } from '@/main/utils/extract'
import GetDataPath from '@/shared/helpers/GetDataPath'
import ChildApp from '@/main/services/childApp/ChildApp'

export default class CommonInstall {
    static async extract(filePath, dest) {
        if (!(await DirUtil.Exists(dest))) {
            await DirUtil.Create(dest)
        }
        if (filePath.endsWith('.zip')) {
            await extractZip(filePath, dest)
        } else if (filePath.endsWith('.tar.xz')) {
            await extractTarXz(filePath, dest)
        }
    }

    /**
     * @param appItem{ChildAppItem}
     * @param force {boolean}
     * @returns {Promise<void>}
     */
    static async configure(appItem,force=false) {
        await ChildAppInit.copyFiles(appItem)
        const ownEtcExists = await DirUtil.Exists(GetDataPath.getOwnEtcDir(appItem.DirName))
        await ChildAppInit.initEtcFiles(appItem)

        if (!ownEtcExists || force) { //虽然一开始ownEtc不存在，但是initEtcFiles会创建ownEtc
            const dirName = appItem.DirName
            if (dirName.match(/^mysql-[.\d]+$/)) {
                const version = ChildAppExtend.getMysqlVersion(dirName)
                await ChildAppInit.initMySQL(version)
            } else if (dirName.match(/^php-[.\d]+$/)) {
                const version = ChildAppExtend.getPHPVersion(dirName)
                await ChildAppInit.initPHP(version)
            } else if (dirName.match(/^nginx$/)) {
                await ChildAppInit.initNginx()
            }
        }
    }

    //强制配置，全部已安装的子应用
    static async configureAll() {
        const list = await ChildApp.getList()
        const childAppList = await Promise.all(list.map(async item => {
            const Installed = await ChildApp.IsInstalled(item)
            return { ...item, Installed }
        }))
        for (const childAppItem of childAppList) {
            if (childAppItem.Installed) {
                await CommonInstall.configure(childAppItem, true)
            }
        }
    }
}
