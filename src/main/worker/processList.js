import { parentPort, workerData } from 'worker_threads'
import HMC from 'hmc-win32'

(async () => {
    const { args } = workerData
    parentPort.postMessage(await getList(...args))
})()

async function getList(options) {
    let list = HMC.getDetailsProcessList()
    if (options) {
        let list1 = [], list2 = []
        if (options.directory) {
            list1 = list.filter(item => item.path.includes(options.directory))
        }
        if (options.pathList) {
            list2 = list.filter(item => options.pathList.includes(item.path))
        }
        list = [...list1, ...list2]
    }

    return list

    // return await Promise.all(
    //     list.map(async (item) => {
    //         const ppid = HMC.getProcessParentProcessID(item.pid)
    //         return { ...item, ppid }
    //     })
    // )
}
