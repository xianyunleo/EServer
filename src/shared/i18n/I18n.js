import { createI18n } from 'vue-i18n'
import zh from '@/shared/i18n/zh'
import en from '@/shared/i18n/en'
import { isRendererProcess } from '@/shared/utils/utils'

export default class I18n {
    static _instance
    static init() {
        if (this._instance) return this._instance
        this._instance = createI18n({
            legacy: !isRendererProcess(),
            locale: 'zh',
            messages: {
                'zh': zh,
                'en': en
            }
        })
    }

    static getInstance() {
        if (!this._instance) this.init()
        return this._instance
    }

    static setLocale(locale) {
        if(isRendererProcess()){
            this._instance.global.locale.value = locale
        }else{
            this._instance.global.locale = locale
        }
    }
}
