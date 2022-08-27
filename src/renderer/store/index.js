import {defineStore} from 'pinia'
import Software from "@/main/core/software/Software";
import {enumGetName} from "@/shared/utils/utils";
import {EnumSoftwareType} from "@/shared/enum";

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
