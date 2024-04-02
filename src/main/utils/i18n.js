import I18n from '@/main/i18n/I18n'

export function t(...arg) {
    const { t: originT } = I18n.getInstance()
    return originT(...arg)
}
