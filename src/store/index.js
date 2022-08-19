import {defineStore} from 'pinia'
import {getList} from "@/main/software/software";

export const useMainStore = defineStore('main', {
    state:  () => {
        let softwareTypeSelected = '';
        let softwareList =  getList();
        return {softwareList, softwareTypeSelected}
    },
    getters: {},
    actions: {}
})
