import Path from "@/main/utils/Path";
import Software from "@/main/core/software/Software";
import FileUtil from "@/main/utils/FileUtil";
import CommonInstall from "@/main/core/software/CommonInstall";


export default class LocalInstall {
    static async install(filePath) {
        let dirName = Path.GetFileNameWithoutExtension(filePath);
        if (dirName.endsWith(".tar")) {
            dirName = Path.GetFileNameWithoutExtension(dirName);
        }
        const dest = this.getDestPath(dirName);
        await CommonInstall.extract(filePath, dest);
        FileUtil.Delete(filePath);
        await CommonInstall.configure(dirName);
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
}
