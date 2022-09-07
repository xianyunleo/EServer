import * as os from "os";

export default class OS {
    static getReleaseVersion() {
        return os.release();
    }
}