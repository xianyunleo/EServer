import * as os from "os";
import is from "electron-is";

export default class OS {
    static getReleaseVersion() {
        return os.release();
    }

    static isMacOS() {
        return is.macOS();
    }

    static isWindows() {
        return is.windows();
    }
}
