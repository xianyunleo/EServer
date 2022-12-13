import Settings from "@/main/Settings";

export default class SettingsExtend {
    static _userPwd = null;

    static getUserPwd() {
        if (SettingsExtend._userPwd == null) {
            SettingsExtend._userPwd = Settings.get('userPwd');
        }
        return SettingsExtend._userPwd;
    }

    //判断是否设置了用户密码
    static isUserPwdSet(){
        return !!Settings.get('userPwd');
    }
}
