import Shell from '@/main/utils/Shell'
import FsUtil from '@/main/utils/FsUtil'

export default class SystemExtend {
    /**
     *
     * @param userPwd
     * @returns {boolean}
     */
    static async checkUserPwd(userPwd) {
        try {
            await Shell.exec(`echo '${userPwd}' | sudo -S -k -l`)
            return true
        } catch {
            return false
        }
    }

    static async isInstalledX64Brew() {
        return await FsUtil.Exists('/usr/local/homebrew/bin/brew')
    }

    static async isInstallRosetta() {
        return await FsUtil.Exists('/Library/Apple/usr/libexec/oah/libRosettaRuntime')
    }

    static async isInstalledBrew() {
        if (process.arch === 'arm64') {
            return await FsUtil.Exists('/opt/homebrew/bin/brew')
        } else {
            return await FsUtil.Exists('/usr/local/homebrew/bin/brew')
        }
    }
}
