import Command from "@/main/core/Command";

export default class SystemExtend {
    /**
     *
     * @param userPwd
     * @returns {boolean}
     */
    static async checkUserPwd(userPwd) {
        try {
            await Command.exec(`echo '${userPwd}' | sudo -S -k -l`);
            return true;
        } catch {
            return false;
        }
    }
}
