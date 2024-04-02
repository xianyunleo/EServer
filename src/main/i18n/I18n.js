import zh from '@/shared/i18n/zh'
import en from '@/shared/i18n/en'
import nls from '@tiny-libs/nls'

export default class I18n {
    static _instance

    static init() {
        if (this._instance) return this._instance
        this._instance = {
            locale: 'zh',
            messages: {
                'zh': zh,
                'en': en
            },
        }
        this._instance.t = this._loadMessages()
    }

    static getInstance() {
        if (!this._instance) this.init()
        return this._instance
    }

    static setLocale(locale) {
        this._instance.locale = locale
        this._instance.t = this._loadMessages()
    }

    static _loadMessages() {
        console.log('this._instance',this._instance)
        const message = this._instance.messages[this._instance.locale]
        const localize = nls.loadMessages(message)

        return (key, args) => {
            return localize(key, '', args)
        }
    }
}
