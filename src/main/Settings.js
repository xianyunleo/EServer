import Store from 'electron-store'
import { SETTINGS_FILE_NAME } from '@/main/helpers/constant'
import path from 'path'
import { isMacOS, isWindows } from '@/main/utils/utils'
import GetDataPath from '@/shared/helpers/GetDataPath'

export default class Settings {
    static #_instance

    static get(key) {
        return this.getInstance().get(key)
    }

    static set(key, val) {
        return this.getInstance().set(key, val)
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
            return this.#_instance
        }
        this.init()
        return this.#_instance
    }

    static init() {
        if (this.#_instance) {
            return
        }
        const options = {
            name: path.parse(SETTINGS_FILE_NAME).name,
            cwd: GetDataPath.getDir()
        }
        options.defaults = this.#_getDefault()
        this.#_instance = new Store(options)
    }

    /**
     * @returns {object}
     */
    static #_getDefault() {
        return {
            Debug: false,
            Language: 'zh',
            ThemeMode: 'system',
            ThemeColor: '#1890FF',
            EnableEnv: false,
            PhpCliVersion: '',
            EnableComposer: false,
            TextEditor: this.#_getDefaultTextEditorPath(),
            WebsiteDir: GetDataPath.getWebsiteDir(),
            OneClickServerList: ['Nginx', 'PHP-FPM', 'MySQL-5.7'],
            AutoStartAndRestartServer: true,
            AfterOpenAppStartServer: false
        }
    }

    static #_getDefaultTextEditorPath() {
        let toolTypePath = GetDataPath.getToolTypeDir()
        if (isMacOS) {
            return path.join(toolTypePath, 'Notepad--.app')
        } else if (isWindows) {
            return path.join(toolTypePath, 'Notepad3/Notepad3.exe')
        }
    }
}
