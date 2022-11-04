import App from "@/main/App";
import Store from "electron-store";
import {SETTINGS_FILE_NAME} from "@/main/constant";
import Path from "@/main/utils/Path";
import File from "@/main/utils/File";

export default class Settings {
    static _instance;
    static _fileName = SETTINGS_FILE_NAME;
    static _fileExtension = 'json';

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
        Settings.init();
        return Settings._instance;
    }

    static init() {
        const options = {
            name: Settings._fileName,
            fileExtension: Settings._fileExtension,
            cwd: Settings.getFileDirPath(),
        };
        if (!File.Exists(Settings.getFilePath())) {
            if (App.isDev()) console.log('配置文件不存在，初始化设置！');
            options.defaults = Settings.getDefault();
        }
        Settings._instance = new Store(options);
    }

    /**
     * @returns {object}
     */
    static getDefault() {
        return {
            phpVersion:'7.4',
        };
    }

    static getFileDirPath(){
        return App.getSettingsPath();
    }

    /**
     * 获取设置文件完整的路径
     * @returns {string}
     */
    static getFilePath(){
        return Path.Join(Settings.getFileDirPath(), `${Settings._fileName}.${Settings._fileExtension}`);
    }
}
