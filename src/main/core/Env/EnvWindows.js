import Command from "@/main/utils/Command";
import GetPath from "@/shared/utils/GetPath";
import { PowerShell } from '@/main/utils/constant'

export default class EnvWindows {
    static _pathVarName = 'PATH'
    static async switch(enable) {
        //PATH的值超过1024，CDM setx命令会截断，所以用PowerShell，并且能指定范围Target
        const binPath = GetPath.getBinDir()
        const varVal = await this.getVarStr(this._pathVarName)
        if (enable) {
            if (!varVal.includes(binPath)) {
               const newVal = `${varVal.trimEnd(';')};${binPath}`
               await this.setVarStr(this._pathVarName, newVal)
            }
        } else {
            //disable remove。假设varVal只有${binPath}一个，那是没有;的，所以要执行第二次replace
            const newVal = varVal.replace(`;${binPath}`, '').replace(binPath, '')
            await this.setVarStr(this._pathVarName, newVal)
        }
    }

    static async IsEnabled() {
        const binPath = GetPath.getBinDir()
        const varVal = this.getPathStr('PATH')
        return varVal.includes(binPath)
    }

    /**
     * 获取用户环境变量的值
     * @param varName {string}
     * @returns {Promise<string>}
     */
    static async getVarStr(varName) {
        const commandStr = `[Environment]::GetEnvironmentVariable('${varName}','User')`
        return (await Command.exec(commandStr, { shell: PowerShell })).trim()
    }

    /**
     * 设置用户环境变量的值
     * @param varName {string}
     * @param varVal {string}
     * @returns {Promise<void>}
     */
    static async setVarStr(varName, varVal) {
        const commandStr = `[Environment]::SetEnvironmentVariable('${varName}','${varVal}','User')`
        await Command.exec(commandStr, { shell: PowerShell })
    }
}
