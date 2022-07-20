import {defineStore} from 'pinia'
import {getList} from "@/main/software/software";
import {SOFTWARE_DEFAULT_TYPE} from "@/main/constant";

export const useMainStore = defineStore('main', {
    state: () => {
        let softwareType = SOFTWARE_DEFAULT_TYPE;
        let softwareList = getList();
        for (const item of softwareList) {
            item.show = softwareType === item.Type;
        }
        return {softwareList,softwareType}
    },
    getters: {},
    actions: {}
})
