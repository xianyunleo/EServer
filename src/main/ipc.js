import { ipcMain } from "electron";
import { callStatic } from "@/main/common/callStatic";

export function ipcListen() {
    ipcMain.handle("callStatic", async (event, className, methodName, args) => {
        await callStatic(className, methodName, args);
    });

    // ipcMain.handle('workerCallStatic', async (event, data) => {
    //     return await new Promise((resolve) => {
    //         console.log('ssb')
    //         setEnvironmentData('electronMain','my api')
    //         console.log('bbs',getEnvironmentData('electronMain'))
    //         const worker = createWorker({workerData: data});
    //         worker.on('message', (message) => resolve(message))
    //         worker.on('error', (err) => {
    //             console.log('worker error', err)
    //         })
    //     })
    // });
}
