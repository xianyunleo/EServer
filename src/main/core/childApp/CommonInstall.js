import ChildAppExtend from "@/main/core/childApp/ChildAppExtend";
import ChildAppInit from "@/main/core/childApp/ChildAppInit";
import DirUtil from "@/main/utils/DirUtil";
import { extract7z, extractTar, extractZip } from '@/main/utils/extract'

export default class CommonInstall {
    static async extract(filePath, dest) {
        if (!await DirUtil.Exists(dest)) {
            await DirUtil.Create(dest);
        }
        if (filePath.endsWith('.zip')) {
            await extractZip(filePath, dest)
        } else if (filePath.endsWith('.7z')) {
            await extract7z(filePath, dest)
        } else if (filePath.endsWith('.tar.xz')) {
            await extractTar(filePath, dest)
        }
    }

    static async configure(appItem) {
        await ChildAppInit.initEtcFiles(appItem)
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
