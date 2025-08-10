import ChildAppExtend from "@/main/services/childApp/ChildAppExtend";
import ChildAppInit from "@/main/services/childApp/ChildAppInit";
import DirUtil from "@/main/utils/DirUtil";
import { extractTarXz, extractZip } from '@/main/utils/extract'
import GetDataPath from '@/shared/helpers/GetDataPath'

export default class CommonInstall {
    static async extract(filePath, dest) {
        if (!await DirUtil.Exists(dest)) {
            await DirUtil.Create(dest);
        }
        if (filePath.endsWith('.zip')) {
            await extractZip(filePath, dest)
        }else if (filePath.endsWith('.tar.xz')) {
            await extractTarXz(filePath, dest)
        }
    }

    static async configure(appItem) {
        await ChildAppInit.copyFiles(appItem)
        const ownEtcExists = await DirUtil.Exists(GetDataPath.getOwnEtcDir(appItem.DirName))
        await ChildAppInit.initEtcFiles(appItem)

        if (!ownEtcExists) { //虽然一开始ownEtc不存在，但是initEtcFiles会创建ownEtc
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
}
