import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import SoftwareInit from "@/main/core/software/SoftwareInit";
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

    static async configure(softItem) {
        await SoftwareInit.initEtc(softItem)
        const dirName = softItem.DirName
        if (dirName.match(/^mysql-[.\d]+$/)) {
            const version = SoftwareExtend.getMysqlVersion(dirName)
            await SoftwareInit.initMySQL(version)
        } else if (dirName.match(/^php-[.\d]+$/)) {
            const version = SoftwareExtend.getPHPVersion(dirName)
            await SoftwareInit.initPHP(version)
        } else if (dirName.match(/^nginx$/)) {
            await SoftwareInit.initNginx()
        }
    }
}
