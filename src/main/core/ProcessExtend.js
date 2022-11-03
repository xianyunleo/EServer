import Command from "@/main/core/Command";
import OS from "@/main/core/OS";

export default class ProcessExtend {
    /**
     *
     * @param name {string}
     * @param isSudo {boolean}
     * @returns {Promise<*>}
     */
    static async killByName(name, isSudo = false) {
        // eslint-disable-next-line no-empty
        if (OS.isWindows()) {

        } else {
            try {
                //pkill杀不存在的进程会有标准错误，从而引发异常
                if (isSudo) {
                    return await Command.sudoExec(`pkill -9 ${name}`);
                } else {
                    return await Command.exec(`pkill -9 ${name}`);
                }
                // eslint-disable-next-line no-empty
            } catch {

            }

        }
    }
}
