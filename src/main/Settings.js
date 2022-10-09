import App from "@/main/App";
import Store from "electron-store"
import {SETTINGS_FILE_NAME} from "@/main/constant";

export default class Settings {
    static instance;

    static get(key) {
        return Settings.getInstance().get(key);
    }

    static set(key, val) {
        return Settings.getInstance().set(key, val);
    }

    /**
     *
     * @returns {ElectronStore<T>}
     */
    static getInstance() {
        if (Settings.instance) {
            return Settings.instance;
        }
        const options = {
            name:SETTINGS_FILE_NAME,
            cwd: App.getSettingsPath()
        };
        const store = new Store(options);
        Settings.instance = store;
        return store;
    }
}
