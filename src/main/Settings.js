import App from "@/main/App";
import Store from "electron-store";
import {MAC_USER_CORE_PATH, SETTINGS_FILE_NAME} from "@/main/constant";
import Path from "@/main/utils/Path";
import OS from "@/main/core/OS";

export default class Settings {
    static #instance;
    static #fileName = SETTINGS_FILE_NAME;
    static #fileExtension = 'json';

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
        if (Settings.#instance) {
            return Settings.#instance;
        }
        Settings.init();
        return Settings.#instance;
    }

    static init() {
        const options = {
            name: Settings.#fileName,
            fileExtension: Settings.#fileExtension,
            cwd: Settings.getFileDirPath(),
        };
        options.defaults = Settings.getDefault();
        Settings.#instance = new Store(options);
    }

    /**
     * @returns {object}
     */
    static getDefault() {
        let obj = {
            EnableEnv: false,
            PhpVersion: '',
            EnableComposer: false,
        };
        if (OS.isMacOS()) {
            obj.TextEditor = Path.Join(MAC_USER_CORE_PATH, 'software/tool/NotepadNext.app');
        }
        return obj;
    }

    static getFileDirPath(){
        return App.getSettingsPath();
    }

    /**
     * 获取设置文件完整的路径
     * @returns {string}
     */
    static getFilePath(){
        return Path.Join(Settings.getFileDirPath(), `${Settings.#fileName}.${Settings.#fileExtension}`);
    }
}
