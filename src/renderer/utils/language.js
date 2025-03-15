import I18n from '@/renderer/i18n/I18n'
import Ipc from '@/renderer/utils/Ipc'

export async function changeLanguageWrapper(lang) {
    I18n.setLocale(lang)
    await Ipc.callStatic('I18n', 'setLocale', lang)
    await Ipc.callStatic('TrayManage', 'updateContextMenu')
}
