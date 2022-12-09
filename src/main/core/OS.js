import * as os from "os";
import is from "electron-is";

export default class OS {
    static _isMacOSLowVersion = null;

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

    static isMacOSLowVersion() {
        if (OS._isMacOSLowVersion != null) {
            return OS._isMacOSLowVersion;
        }

        if (OS.isMacOS()) {
            let mainVersion = OS.getReleaseVersion().split('.')[0];
            //https://en.wikipedia.org/wiki/Darwin_(operating_system)
            //<=macOS 10.13 High Sierra
            if (Number(mainVersion) <= 17) {
                OS._isMacOSLowVersion = true;
                return true;
            }
        }
        OS._isMacOSLowVersion = false;
        return false;
    }
}
