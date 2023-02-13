import Command from "@/main/core/Command";
import OS from "@/main/core/OS";

export default class ProcessExtend {
    /**
     *
     * @param pid {number}
     * @returns {Promise<*>}
     */
    static async kill(pid) {
        try {
            if (OS.isWindows()) {
                //taskkill杀不存在的进程会有标准错误，从而引发异常
                await Command.exec(`taskkill /f /t /pid ${pid}`);
            } else {
                //pkill杀不存在的进程会有标准错误，从而引发异常
                await Command.sudoExec(`kill -9 ${pid}`);
            }
            // eslint-disable-next-line no-empty
        } catch {

        }
    }

    /**
     *
     * @param name {string}
     * @returns {Promise<*>}
     */
    static async killByName(name) {
        try {
            if (OS.isWindows()) {
                //taskkill杀不存在的进程会有标准错误，从而引发异常
                await Command.exec(`taskkill /f /t /im ${name}`);
            } else {
                //pkill杀不存在的进程会有标准错误，从而引发异常
                await Command.sudoExec(`pkill -9 ${name}`);
            }
            // eslint-disable-next-line no-empty
        } catch {

        }
    }

    static async getList(searchObj={}) {
        if (OS.isMacOS()) {
            return await ProcessExtend.getListByMacOS(searchObj);
        }else if(OS.isWindows()){
            return await ProcessExtend.getListByWindows(searchObj);
        }
        return [];
    }

    static async getListByMacOS(searchObj={}) {
        let command = 'lsof -w -d txt';
        if (searchObj) {
            if(searchObj.directory){
                command += `|grep ${searchObj.directory}`;  //这里不能使用lsof的+D参数，会有exit code，且性能不好
            }
        }
        command += "|awk '{print $1,$2,$9}'";
        try {
            let str =  await Command.sudoExec(command);
            str = str.trim();
            if(!str){
                return [];
            }
            let list = str.split('\n');

            list = list.map(item => {
                let arr = item.split(' ');
                let name, pid, path;
                [name, pid, path] = arr;
                return {name, pid, path};
            });

            return list;
        }catch(e){
            return  [];
        }

    }

    static async getListByWindows(searchObj={}) {
        let command = 'wmic process where ';
        if (searchObj) {
            if(searchObj.directory){
                let formatDir =searchObj.directory.replaceAll('\\','\\\\');
                command += `"ExecutablePath like '${formatDir}%'"`;
            }
        }
        command += " get ProcessID, Name, ExecutablePath";

        try {
            let str =  await Command.exec(command);
            str = str.trim();
            if(!str){
                return [];
            }
            let list = str.split('\n');
            list = list.map(item => {
                let arr = item.split(/\s+/);
                let name, pid, path;
                [path,name, pid] = arr;
                return {name, pid, path};
            });
            return list;
        }catch(e){
            return  [];
        }
    }
}
