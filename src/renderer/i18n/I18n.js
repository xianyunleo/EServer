import { createI18n } from 'vue-i18n'
import zh from '@/renderer/i18n/zh'
import en from '@/renderer/i18n/en'

export default class I18n {
    static #_instance
    static getInstance() {
        if (!this.#_instance) {
            this.#_instance = createI18n({
                legacy: false,
                locale: 'zh',
                messages: {
                    'zh': zh,
                    'en': en
                }
            })
        }
        return this.#_instance
    }
}
