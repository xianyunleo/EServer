import { electronRequire } from '@/main/utils/electron'

const nativeTheme = electronRequire('nativeTheme')
const systemPreferences = electronRequire('systemPreferences')
export default class SystemTheme {
    static isDarkModel() {
        return nativeTheme.shouldUseDarkColors;
    }

    static getColor(){
        return systemPreferences.getAccentColor();
    }

}
