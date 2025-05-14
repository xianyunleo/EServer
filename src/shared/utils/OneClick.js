import Settings from '@/main/Settings'
import ChildAppExtend from '@/main/services/childApp/ChildAppExtend'

export default class OneClick {
    /**
     * 根据serverList，结合OneClickServerList设置，一键操作
     * @param serverList {array} 已安装的server列表
     * @param func {function}
     * @returns {Promise<void>}
     */
    static async handle(func, serverList) {
        const oneClickServerList = Settings.get('OneClickServerList')
        const websitePhpFpmSwitch = oneClickServerList.includes('PHP-FPM')
        const requirePhpList = await OneClick.getNginxRequirePhpList()

        const doAsync = async (item) => {
            if (oneClickServerList.includes(item.Name)) {
                func(item)
            } else if (websitePhpFpmSwitch && requirePhpList.includes(item.Name.toUpperCase())) {//自动判断网站列表的PHP-FPM
                func(item)
            }
        }

        for (const item of serverList) {
            doAsync(item)
        }
    }

    static async getNginxRequirePhpList() {
        const list = await ChildAppExtend.getNginxRequirePhpList()
        return list.map((item) => `PHP-${item}`)
    }
}
