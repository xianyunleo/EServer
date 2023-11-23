import { parentPort, workerData } from 'worker_threads'
import HMC from 'hmc-win32'

(async () => {
    const { args } = workerData
    parentPort.postMessage(await getList(...args))
})()

async function getList(options) {
    let list = HMC.getDetailsProcessList()
    if (options) {
        if (options.directory) {
            list = list.filter(item => item.path.includes(options.directory))
        }
    }

    return await Promise.all(
        list.map(async (item) => {
            const ppid = HMC.getProcessParentProcessID(item.pid)
            return { ...item, ppid }
        })
    )
}
