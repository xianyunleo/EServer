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
            return await Command.exec(`pkill -9 ${name}`);
        }
    }
}