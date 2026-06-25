import { ChildAppTypes } from '@/main/helpers/constant'

/**
 * 根据子应用列表的Type字段判断，筛选出服务列表
 * @param childAppList
 * @returns {*}
 */
export function filterServiceList(childAppList) {
    return childAppList.filter(item => isRealServer(item.Type))
}

export function isRealServer(type) {
    return [ChildAppTypes.Server, ChildAppTypes.PHP].includes(type)
}
