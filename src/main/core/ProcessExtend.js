import Command from "@/main/core/Command";
import OS from "@/main/core/OS";
import TcpProcess from "@/main/core/TcpProcess";

export default class ProcessExtend {
    /**
     *  杀死进程和子进程
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
                await Command.sudoExec(`kill ${pid}`);
            }
            // eslint-disable-next-line no-empty
        } catch {

        }
    }

    /**
     * 杀死进程和子进程
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
                await Command.sudoExec(`pkill ${name}`);
            }
            // eslint-disable-next-line no-empty
        } catch {

        }
    }

    static pidIsRunning(pid) {
        try {
            process.kill(pid, 0);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     *
     * @returns {Promise<Awaited<*>[]>}
     */
    static async killWebServer() {
        return await Promise.all([
            ProcessExtend.killByName('httpd'),
            ProcessExtend.killByName('nginx'),
        ]);
    }

    /**
     *
     * @param searchObj
     * @returns {Promise<[]|{path: *, name: *, pid: *, ppid: *}[]>}
     */
    static async getList(searchObj={}) {
        if (OS.isMacOS()) {
            return await ProcessExtend.getListByMacOS(searchObj);
        }else if(OS.isWindows()){
            return await ProcessExtend.getListByWindows(searchObj);
        }
        return [];
    }

    static async getListByMacOS(searchObj={}) {
        let command = 'lsof -w -R -d txt';
        if (searchObj) {
            if(searchObj.directory){
                command += `|grep ${searchObj.directory}`;  //这里不能使用lsof的+D参数，会有exit code，且性能不好
            }
        }
        command += "|grep -v .dylib|awk '{print $1,$2,$3,$10}'";
        try {
            let str =  await Command.sudoExec(command);
            str = str.trim();
            if(!str){
                return [];
            }
            let list = str.split('\n');

            list = list.map(item => {
                let arr = item.split(' ');
                let name, pid, ppid, path;
                [name, pid, ppid, path] = arr;
                return {name, pid, ppid, path};
            });

            return list;
        }catch(e){
            return  [];
        }

    }

    static async getListByWindows(searchObj={}) {
        let command = ' Get-WmiObject -Class Win32_Process -Filter ';
        if (searchObj) {
            if(searchObj.directory){
                let formatDir =searchObj.directory.replaceAll('\\','\\\\');
                command += `"ExecutablePath like '${formatDir}%'"`;
            }
        }
        command += " |Select-Object Name,ProcessId,ParentProcessId,ExecutablePath";

        try {
            let str =  await Command.exec(command,{shell: 'powershell'});
            str = str.trim();
            if(!str){
                return [];
            }
            let list = str.split('\n');
            list.shift();
            list.shift();
            list = list.map(item => {
                let arr = item.split(/\s+/);
                let name, pid, ppid, path;
                [name, pid, ppid, path] = arr;
                return {name, pid, ppid, path};
            });
            return list;
        }catch(e){
            return  [];
        }
    }
}
