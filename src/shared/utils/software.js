import { enumGetName } from '@/shared/utils/utils'
import { EnumSoftwareType } from '@/shared/utils/enum'

/**
 * 根据列表，获取Server列表
 * @param softwareList
 * @returns {*}
 */
export function filterServerList(softwareList) {
    const phpTypeName = enumGetName(EnumSoftwareType, EnumSoftwareType.PHP)
    const serverTypeName = enumGetName(EnumSoftwareType, EnumSoftwareType.Server)
    const typeArr = [phpTypeName, serverTypeName]
    return softwareList.filter(item => typeArr.includes(item.Type))
}
