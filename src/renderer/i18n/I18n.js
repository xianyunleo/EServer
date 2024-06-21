import { createI18n } from 'vue-i18n'
import zh from '@/shared/i18n/zh'
import en from '@/shared/i18n/en'
import fr from '@/shared/i18n/fr'

export default class I18n {
    static _instance
    static init() {
        if (this._instance) return this._instance
        this._instance = createI18n({
            legacy: false,
            locale: 'zh',
            messages: {
                zh: zh,
                en: en,
                fr: fr
            }
        })
    }

    static getInstance() {
        if (!this._instance) this.init()
        return this._instance
    }

    static setLocale(locale) {
        this._instance.global.locale.value = locale
    }
}
