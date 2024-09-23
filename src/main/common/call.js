import { Worker } from 'node:worker_threads'

export async function callStatic(className, methodName, ...args) {
    let result, importReturn

    const utilsClassArr = ['ProcessLibrary', 'FileDialog']
    if (utilsClassArr.includes(className)) {
        importReturn = await import(`@/main/utils/${className}.js`)
    } else if (className === 'I18n') {
        importReturn = await import(`@/main/i18n/I18n.js`)
    } else {
        importReturn = await import(`@/main/${className}.js`)
    }

    const moduleClass = importReturn.default
    result = args ? await moduleClass[methodName](...args) : await moduleClass[methodName]()
    return result
}

export async function callWorker(workName, ...args) {
    let importReturn
    if (workName === 'processList') {
        importReturn = await import(`@/main/worker/processList.js?modulePath`)
        //?modulePath 不支持变量
    }
    const workerPath = importReturn.default

    return new Promise((resolve, reject) => {
        const worker = new Worker(workerPath, { workerData: { args } })
        worker.on('message', resolve)
        worker.on('error', reject)
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
        })
    })
}
