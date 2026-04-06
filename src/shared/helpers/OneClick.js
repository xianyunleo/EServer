import Settings from '@/main/Settings'
import ChildAppExtend from '@/main/services/childApp/ChildAppExtend'

export default class OneClick {
    /**
     * 根据serviceList，结合OneClickServiceList设置，一键操作
     * @param serviceList {array} 已安装的server列表
     * @param func {function}
     * @returns {Promise<void>}
     */
    static async handle(func, serviceList) {
        const oneClickServiceList = Settings.get('OneClickServiceList')
        const websitePhpFpmSwitch = oneClickServiceList.includes('PHP-FPM')
        const requirePhpList = await OneClick.getNginxRequirePhpList()

        const doAsync = async (item) => {
            if (oneClickServiceList.includes(item.Name)) {
                await func(item)
            } else if (websitePhpFpmSwitch && requirePhpList.includes(item.Name.toUpperCase())) {
                //自动判断网站列表的PHP-FPM
                await func(item)
            }
        }

        const promiseArr = serviceList.map((item) => doAsync(item))
        await Promise.all(promiseArr)
    }

    static async getNginxRequirePhpList() {
        const list = await ChildAppExtend.getNginxRequirePhpList()
        return list.map((item) => `PHP-${item}`)
    }
}
