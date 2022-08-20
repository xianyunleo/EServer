import {defineStore} from 'pinia'
import Software from "@/main/software/Software";

export const useMainStore = defineStore('main', {
    state: () => {
        let softwareTypeSelected = '';
        let softwareList = Software.getList();
        return {softwareList, softwareTypeSelected}
    },
    getters: {},
    actions: {}
})
