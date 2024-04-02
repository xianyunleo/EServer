import I18n from '@/renderer/i18n/I18n'

export function t(...arg) {
    const { t: originT } = I18n.getInstance().global
    return originT(...arg)
}

export function mt(...args) {
    const { t: originT } = I18n.getInstance().global
    let str = ''
    for (const arg of args) {
        str += originT(arg)
    }
    return str
}
