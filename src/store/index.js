import {defineStore} from 'pinia'
import Software from "@/main/software/Software";
import {enumGetName} from "@/main/utils";
import {EnumSoftwareType} from "@/main/enum";

export const useMainStore = defineStore('main', {
    state: () => {
        const softwareTypeSelected = '';
        const softwareList = Software.getList();
        const serverList = softwareList.filter(item => item.Type === enumGetName(EnumSoftwareType, EnumSoftwareType.Server));
        return {softwareList, softwareTypeSelected, serverList};
    },
    getters: {},
    actions: {}
})
