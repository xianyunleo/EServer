import {defineStore} from 'pinia'
import Software from "@/main/core/software/Software";
import {enumGetName} from "@/shared/utils/utils";
import {EnumSoftwareType} from "@/shared/enum";

export const useMainStore = defineStore('main', {
    state: () => {
        const softwareTypeSelected = '';
        const softwareList = Software.getList();

        let phpTypeName = enumGetName(EnumSoftwareType, EnumSoftwareType.PHP);
        let serverTypeName = enumGetName(EnumSoftwareType, EnumSoftwareType.Server);
        let typeArr = [phpTypeName, serverTypeName];
        const serverSoftwareList = softwareList.filter(item => typeArr.includes(item.Type));

        return {softwareList, softwareTypeSelected, serverSoftwareList};
    },
    getters: {},
    actions: {}
})
