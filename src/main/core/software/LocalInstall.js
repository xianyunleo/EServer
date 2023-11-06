import Path from "@/main/utils/Path";
import Software from "@/main/core/software/Software";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import SoftwareInit from "@/main/core/software/SoftwareInit";
import Directory from "@/main/utils/Directory";
import GetPath from "@/shared/utils/GetPath";
import Database from "@/main/core/Database";
import {isWindows} from "@/main/utils/utils";
import {extract7z, extractTar} from "@/main/utils/extract";
import FileUtil from "@/main/utils/FileUtil";
import CommonInstall from "@/main/core/software/CommonInstall";


export default class LocalInstall {
    static async install(filePath) {
        const dirName = Path.GetFileNameWithoutExtension(filePath);
        const dest = this.getDestPath(dirName);
        await this.extract(filePath, dest, dirName);
        FileUtil.Delete(filePath);
        await CommonInstall.configure(dirName);
    }

    static async extract(filePath, dest, dirName) {
        if (!Directory.Exists(dest)) {
            Directory.CreateDirectory(dest);
        }
        if (isWindows) {
            await extract7z(filePath, dest);
        } else {
            const downloadsDir = GetPath.getDownloadsDir();
            await extract7z(filePath, downloadsDir);
            const tarPath = Path.Join(downloadsDir, `${dirName}.tar`);
            await extractTar(tarPath, dest)
            FileUtil.Delete(tarPath);
        }
    }

    static async installMultiple(files) {
        await Promise.all(files.map(async install => {
            await LocalInstall.install(install);
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
