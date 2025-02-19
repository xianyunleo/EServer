import { enumGetName } from '@/shared/utils/utils'
import { EnumChildAppType } from '@/shared/utils/enum'

/**
 * 根据列表，获取Server列表
 * @param childAppList
 * @returns {*}
 */
export function filterServerList(childAppList) {
    const phpTypeName = enumGetName(EnumChildAppType, EnumChildAppType.PHP)
    const serverTypeName = enumGetName(EnumChildAppType, EnumChildAppType.Server)
    const typeArr = [phpTypeName, serverTypeName]
    return childAppList.filter(item => typeArr.includes(item.Type))
}
