import * as os from "os";
import is from "electron-is";

export default class OS {
    static getReleaseVersion() {
        return os.release();
    }

    static getUserName() {
        return os.userInfo().username;
    }

    static isMacOS() {
        return is.macOS();
    }

    static isWindows() {
        return is.windows();
    }
}
