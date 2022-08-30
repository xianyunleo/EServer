import GetPath from "@/shared/utils/GetPath";
import fs from "fs";

export default class Hosts {
    /**
     *
     * @returns {boolean}
     */
    static canEditHosts() {
        let path = GetPath.getHostsPath();
        try {
            fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch {
            return false;
        }
    }
}