import Settings from "@/main/Settings";

export default class SettingsExtend {
    static #userPwd = null;

    static getUserPwd() {
        if (SettingsExtend.#userPwd == null) {
            SettingsExtend.#userPwd = Settings.get('userPwd');
        }
        return SettingsExtend.#userPwd;
    }

    //判断是否设置了用户密码
    static isUserPwdSet(){
        return !!Settings.get('userPwd');
    }
}
