import {defineStore} from 'pinia'
import {getList} from "@/main/software";
//import Downloader from "@/main/Downloader";
import {SOFTWARE_DEFAULT_TYPE} from "@/main/constant";

export const useMainStore = defineStore('main', {
    state: () => {
        let softwareType = SOFTWARE_DEFAULT_TYPE;
        let softwareList = getList();
        for (const item of softwareList) {
            item.dlInfo = null;
            item.show = softwareType === item.Type;
        }
        let singleSoftware = softwareList[0];
        return {softwareList,softwareType,singleSoftware}
    },
    getters: {},
    actions: {}
})
