import Command from "@/main/Command";
import ProcessExtend from "@/main/ProcessExtend";
import path from "path";
import Software from "@/main/software/Software";

export default class ServerControl {
    /**
     *
     * @param item {SoftwareItem}
     */
    static async start(item) {
        try{
            if (item.Name === 'Nginx') {
                await ServerControl.killWebServer();
            }else {
                await ProcessExtend.killByName(item.ServerProcessName);
            }
            // eslint-disable-next-line no-empty
        }catch{

        }

        let serverPath = Software.getPath(item);
        let command = path.join(serverPath, item.ServerProcessPath)
        await Command.exec(command, serverPath);
    }

    /**
     *
     * @returns {Promise<Awaited<*>[]>}
     */
    static async killWebServer() {
        return await Promise.all([
            ProcessExtend.killByName('httpd'),
            ProcessExtend.killByName('nginx'),
        ]);
    }
}