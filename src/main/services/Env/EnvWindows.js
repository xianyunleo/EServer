import Shell from "@/main/utils/Shell";
import GetDataPath from "@/shared/utils/GetDataPath";
import { PowerShell } from '@/main/utils/constant'

export default class EnvWindows {
    static _pathVarName = 'PATH'

    static async switch(enable) {
        //PATH的值超过1024，CDM setx命令会截断，所以用PowerShell，并且能指定范围Target
        const binPath = GetDataPath.getBinDir()
        const varVal = await this.getVarStr(this._pathVarName)
        const valArr =  varVal ? varVal.split(';').filter(v => !!v) : []
        if (enable) {
            if (!valArr.includes(binPath)) {
                const newVal = [...valArr, binPath].join(';')
                await this.setVarStr(this._pathVarName, newVal)
            }
        } else {
            const newVal = valArr.filter(v => v !== binPath).join(';')
            await this.setVarStr(this._pathVarName, newVal)
        }
    }

    /**
     * 获取用户环境变量的值
     * @param varName {string}
     * @returns {Promise<string>}
     */
    static async getVarStr(varName) {
        const commandStr = `[Environment]::GetEnvironmentVariable('${varName}','User')`
        return (await Shell.exec(commandStr, { shell: PowerShell })).trim()
    }

    /**
     * 设置用户环境变量的值
     * @param varName {string}
     * @param varVal {string}
     * @returns {Promise<void>}
     */
    static async setVarStr(varName, varVal) {
        const commandStr = `[Environment]::SetEnvironmentVariable('${varName}','${varVal}','User')`
        await Shell.exec(commandStr, { shell: PowerShell })
    }
}
