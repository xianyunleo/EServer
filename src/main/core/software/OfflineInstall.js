import Path from "@/main/utils/Path";
import Software from "@/main/core/software/Software";
import { EnumSoftwareInstallStatus } from "@/shared/utils/enum";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import SoftwareInit from "@/main/core/software/SoftwareInit";
import Directory from "@/main/utils/Directory";
import GetPath from "@/shared/utils/GetPath";
import Database from "@/main/core/Database";
import { isWindows } from "@/main/utils/utils";
import { Modal } from "ant-design-vue";
import CommonInstall from "@/main/core/software/CommonInstall";
import File from "@/main/utils/File";
import { extract7z } from "@/main/utils/extract";


export default class OfflineInstall {
    static async install(filePath) {
        const dirName = Path.GetFileNameWithoutExtension(filePath);
        const dest = this.getDestPath(dirName);
        await extract7z(filePath,dest);
        File.Delete(filePath);
        await CommonInstall.configure(dirName);
    }

    static async installMultiple(files) {
        await Promise.all(files.map(async install => {
            await OfflineInstall.install(install);
        }));
    }

    static getDestPath(dirName) {
        const softList = Software.getList();
        const item = softList.find(item => item.DirName === dirName);
        if (!item) {
            throw new Error("离线安装失败，不匹配");
        }
        return Software.getTypePath(item.Type);
    }

    static async configure(dirName) {
        if (dirName.match(/^mysql-[.\d]+$/)) {
            let version = SoftwareExtend.getMysqlVersion(dirName);
            await SoftwareInit.initMySQLConf(version);
            if (!Directory.Exists(GetPath.getMysqlDataDir(version))) {
                await Database.initMySQL(version);
            }
        } else if (dirName.match(/^php-[.\d]+$/)) {
            let version = SoftwareExtend.getPHPVersion(dirName);
            //配置文件某些配置可能是tmp作为目录，需要改成temp
            await SoftwareInit.initPHPConf(version);
            if (!isWindows) {
                await SoftwareInit.createPHPFpmConf(version);
            }
        }

    }
}
