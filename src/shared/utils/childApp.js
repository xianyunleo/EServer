import { enumGetName } from '@/shared/utils/utils'
import { EnumChildAppType } from '@/shared/utils/enum'

/**
 * 根据子应用列表的Type字段判断，筛选出Server列表
 * @param childAppList
 * @returns {*}
 */
export function filterServerList(childAppList) {
    const phpTypeName = enumGetName(EnumChildAppType, EnumChildAppType.PHP)
    const serverTypeName = enumGetName(EnumChildAppType, EnumChildAppType.Server)
    const typeArr = [phpTypeName, serverTypeName]
    return childAppList.filter(item => typeArr.includes(item.Type))
}
