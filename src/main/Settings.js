import App from "@/main/App";
import Store from "electron-store";
import {SETTINGS_FILE_NAME} from "@/main/constant";

export default class Settings {
    static _instance;

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
        if (Settings._instance) {
            return Settings._instance;
        }
        const options = {
            name:SETTINGS_FILE_NAME,
            cwd: App.getSettingsPath()
        };
        const store = new Store(options);
        Settings._instance = store;
        return store;
    }
}
