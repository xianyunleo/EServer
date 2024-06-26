import zh from '@/shared/i18n/zh'
import en from '@/shared/i18n/en'
import fr from '@/shared/i18n/fr'
import nls from '@tiny-libs/nls'

export default class I18n {
    static _instance

    static init() {
        if (this._instance) return this._instance
        this._instance = {
            locale: 'zh',
            messages: {
                zh: zh,
                en: en,
                fr: fr
            }
        }
        this._instance.translate = this._loadMessages()
    }

    static getInstance() {
        if (!this._instance) this.init()
        return this._instance
    }

    static setLocale(locale) {
        this._instance.locale = locale
        this._instance.translate = this._loadMessages()
    }

    static _loadMessages() {
        const message = this._instance.messages[this._instance.locale]
        const localize = nls.loadMessages(message)

        return (key, ...args) => {
            return localize(key, '', ...args)
        }
    }

    static t(...args) {
        return this._instance.translate(...args)
    }
}
