import Command from "@/main/core/Command";
import GetPath from "@/shared/utils/GetPath";

export default class EnvWindows {
    static async switch(enable) {
        let binPath = GetPath.getBinPath();
        //PATH的值超过1024，setx命令会截断，所以用PowerShell，并且能指定EnvironmentVariableTarget
        let commandStr = `PowerShell -Command "& {[Environment]::GetEnvironmentVariable('PATH','User');}"`;
        let value = (await Command.exec(commandStr)).trim();
        if (enable) {
            commandStr = `PowerShell -Command "& {[Environment]::SetEnvironmentVariable('PATH','${value};${binPath}','User');}"`;
        } else {
            value = value.replaceAll(`;${binPath}`, '');
            commandStr = `PowerShell -Command "& {[Environment]::SetEnvironmentVariable('PATH','${value}','User');}"`;
        }
        await Command.exec(commandStr);
    }

    static async IsEnabled() {
        let binPath = GetPath.getBinPath();
        let commandStr = `PowerShell -Command "& {[Environment]::GetEnvironmentVariable('PATH','User');}"`;
        let value = await Command.exec(commandStr);
        return value.includes(binPath);
    }

}
