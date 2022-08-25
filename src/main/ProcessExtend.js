import Command from "@/main/Command";
import is from "electron-is";

export default class ProcessExtend{
    /**
     *
     * @param name
     * @returns {Promise<*>}
     */
    static async killByName(name) {
        // eslint-disable-next-line no-empty
        if (is.windows()) {

        } else {
            try{
                //pkill杀不存在的进程会有标准错误，从而引发异常
                return await Command.exec(`pkill -9 ${name}`);
                // eslint-disable-next-line no-empty
            }catch{

            }

        }
    }
}