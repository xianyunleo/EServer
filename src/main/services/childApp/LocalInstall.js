import ChildApp from "@/main/services/childApp/ChildApp";
import FileUtil from "@/main/utils/FileUtil";
import CommonInstall from "@/main/services/childApp/CommonInstall";
import PathExt from '@/shared/utils/PathExt'


export default class LocalInstall {
    /**
     * 执行本地安装
     * @param filePath 压缩包文件路径
     * @param deleteSrc 安装后是否删除源压缩包文件
     * @returns {Promise<void>}
     */
    static async install(filePath, deleteSrc = false) {
        const dirName = this.getDirName(filePath)
        const appItem = await ChildApp.getItemByDirName(dirName)
        const dest = appItem ? ChildApp.getTypeDir(appItem.Type) : null
        if (!dest) return
        await CommonInstall.extract(filePath, dest)
        if (deleteSrc){
            await FileUtil.Delete(filePath)
        }
        await CommonInstall.configure(appItem)
    }

    static async installMultiple(files) {
        await Promise.all(files.map(async file => {
            await LocalInstall.install(file,true);
        }));
    }

    static getDirName(filePath) {
        let dirName = PathExt.GetFileNameWithoutExt(filePath);
        if (dirName.endsWith('.tar')) {
            dirName = PathExt.GetFileNameWithoutExt(dirName);
        }
        return dirName;
    }
}
