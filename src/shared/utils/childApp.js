import { ChildAppTypes } from '@/main/utils/constant'

/**
 * 根据子应用列表的Type字段判断，筛选出Server列表
 * @param childAppList
 * @returns {*}
 */
export function filterServerList(childAppList) {
    return childAppList.filter(item => isRealServer(item.Type))
}

export function isRealServer(type) {
    return [ChildAppTypes.Server, ChildAppTypes.PHP].includes(type)
}
