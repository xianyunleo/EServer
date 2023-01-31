import Command from "@/main/core/Command";
import OS from "@/main/core/OS";

export default class ProcessExtend {
    /**
     *
     * @param name {string}
     * @returns {Promise<*>}
     */
    static async killByName(name) {
        if (OS.isWindows()) {
            try {
                //taskkill杀不存在的进程会有标准错误，从而引发异常
                await Command.exec(`taskkill /f /t /im ${name}`);
                // eslint-disable-next-line no-empty
            } catch {

            }

        } else {
            try {
                //pkill杀不存在的进程会有标准错误，从而引发异常
                await Command.sudoExec(`pkill -9 ${name}`);
                // eslint-disable-next-line no-empty
            } catch {

            }

        }
    }

    static async getList(searchObj={}) {
        if (OS.isMacOS()) {
            return await ProcessExtend.getListByMacOS(searchObj);
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
}
