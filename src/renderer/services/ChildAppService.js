import { ChildAppTypes as ChildAppType } from '@/main/utils/constant'
import ChildAppExtend from '@/main/services/childApp/ChildAppExtend'
import { useMainStore } from '@/renderer/store'

const store = useMainStore()
export default class ChildAppService {
    static getPhpOptions() {
        const list = store.installedChildAppList.filter(item => item.Type === ChildAppType.PHP)
        return list.map(item => {
            return { value: ChildAppExtend.getPHPVersion(item.Name), label: item.Name, isCustom: item.IsCustom }
        })
    }

    static getMysqlOptions() {
        const list = store.installedChildAppList.filter(item => item.Type === ChildAppType.Server)
        const options = []
        for (const item of list) {
            const version = ChildAppExtend.getMysqlVersion(item.Name)
            if (version) {
                options.push({ value: version, label: item.Name })
            }
        }
        return options
    }
}
