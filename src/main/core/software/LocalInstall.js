import Path from "@/main/utils/Path";
import Software from "@/main/core/software/Software";
import FileUtil from "@/main/utils/FileUtil";
import CommonInstall from "@/main/core/software/CommonInstall";


export default class LocalInstall {
    /**
     * 执行本地安装
     * @param filePath 压缩包文件路径
     * @param deleteSrc 安装后是否删除源压缩包文件
     * @returns {Promise<void>}
     */
    static async install(filePath, deleteSrc = false) {
        const dirName = this.getDirName(filePath)
        const dest = await this.getDestPath(dirName)
        if (!dest) return
        await CommonInstall.extract(filePath, dest)
        if (deleteSrc){
            await FileUtil.Delete(filePath)
        }
        await CommonInstall.configure(dirName)
    }

    static async installMultiple(files) {
        await Promise.all(files.map(async install => {
            await LocalInstall.install(install,true);
        }));
    }

    static async getDestPath(dirName) {
        const softList = await Software.getList();
        const item = softList.find(item => item.DirName === dirName);
        return item ? Software.getTypePath(item.Type) : null;
    };

    static getDirName(filePath) {
        let dirName = Path.GetFileNameWithoutExt(filePath);
        if (dirName.endsWith('.tar')) {
            dirName = Path.GetFileNameWithoutExt(dirName);
        }
        return dirName;
    }
}
