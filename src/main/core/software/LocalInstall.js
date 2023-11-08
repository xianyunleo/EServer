import Path from "@/main/utils/Path";
import Software from "@/main/core/software/Software";
import FileUtil from "@/main/utils/FileUtil";
import CommonInstall from "@/main/core/software/CommonInstall";


export default class LocalInstall {
    static async install(filePath) {
        const dirName = this.getDirName(filePath);
        const dest = this.getDestPath(dirName);
        if (!dest) return;
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
        return item ? Software.getTypePath(item.Type) : null;
    };

    static getDirName(filePath) {
        let dirName = Path.GetFileNameWithoutExtension(filePath);
        if (dirName.endsWith('.tar')) {
            dirName = Path.GetFileNameWithoutExtension(dirName);
        }
        return dirName;
    }
}
