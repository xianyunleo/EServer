import App from '@/main/App'
import Store from 'electron-store'
import { SETTINGS_FILE_NAME } from '@/main/utils/constant'
import Path from '@/main/utils/Path'
import GetPath from '@/shared/utils/GetPath'
import { isMacOS, isWindows } from '@/main/utils/utils'

export default class Settings {
    static #_instance;
    static #_fileName = SETTINGS_FILE_NAME;
    static #_fileExtension = 'json';

    static get(key) {
        return this.getInstance().get(key);
    }

    static set(key, val) {
        return this.getInstance().set(key, val);
    }

    static getAll() {
        return this.getInstance().store
    }

    /**
     *
     * @returns {ElectronStore<T>}
     */
    static getInstance() {
        if (this.#_instance) {
            return this.#_instance;
        }
        this.init();
        return this.#_instance;
    }

    static init() {
        if (this.#_instance) {
            return;
        }
        const options = {
            name: this.#_fileName,
            fileExtension: this.#_fileExtension,
            cwd: this.getDir(),
        };
        options.defaults = this.#_getDefault();
        this.#_instance = new Store(options);
    }

    /**
     * @returns {object}
     */
    static #_getDefault() {
        return {
            Language:'zh',
            ThemeMode:'system',
            ThemeColor:'#1890FF',
            EnableEnv: false,
            PhpCliVersion: '',
            EnableComposer: false,
            TextEditor: this.#_getDefaultTextEditorPath(),
            WebsiteDir: Path.Join(App.getUserCoreDir(), 'www'),
            OneClickServerList: ['Nginx', 'PHP-FPM', 'MySQL-5.7'],
            AutoStartAndRestartServer: true,
        };
    }

    static #_getDefaultTextEditorPath() {
        let toolTypePath =  GetPath.getToolTypeDir();
        if (isMacOS) {
           return Path.Join(toolTypePath, 'Notepad--.app');
        } else if (isWindows) {
            return Path.Join(toolTypePath, 'Notepad3/Notepad3.exe');
        }
    }

    static getDir(){
        return App.getSettingsDir();
    }

    /**
     * 获取设置文件完整的路径
     * @returns {string}
     */
    static getFilePath(){
        return Path.Join(this.getDir(), `${this.#_fileName}.${this.#_fileExtension}`);
    }
}
