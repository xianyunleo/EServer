import { t } from '@/renderer/utils/i18n'
import path from 'path'
import GetDataPath from '@/shared/utils/GetDataPath'
import FileUtil from '@/main/utils/FileUtil'
import { useMainStore } from '@/renderer/store'
import { ChildAppTypes as ChildAppType } from '@/main/utils/constant'
import ChildAppExtend from '@/main/services/childApp/ChildAppExtend'

const store = useMainStore()

export default class WebsiteService {
    static getPhpOptions() {
        const list = store.installedChildAppList.filter(item => item.Type === ChildAppType.PHP)
        const list2 = store.customChildAppList.filter(item => item.Type === ChildAppType.PHP)
        const options = list.concat(list2).map(item => {
            return { value: ChildAppExtend.getPHPVersion(item.Name), label: item.Name, isCustom: item.IsCustom }
        })
        options.push({ value: '', label: t('Static') })
        return options
    }

    static async checkCustomPhpConf(version, phpOptions) {
        const option = phpOptions.find(item => item.value === version)
        if (option.isCustom) {
            const confPath = path.join(GetDataPath.getNginxPhpConfDir(), `php-${version}.conf`)
            if (!await FileUtil.Exists(confPath)) {
                throw new Error(`${confPath}\n${t('does not exist!')}`)
            }
        }
    }
}
