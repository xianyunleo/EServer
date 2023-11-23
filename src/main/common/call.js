export async function callStatic(className, methodName, ...args) {
    let result, importReturn
    if (['ProcessLibrary'].includes(className)) {
        importReturn = await import(`@/main/utils/${className}.js`)
    }
    const moduleClass = importReturn.default
    result = args ? await moduleClass[methodName](...args) : await moduleClass[methodName]()
    return result
}

export async function callWorker(workName, ...args) {
    let createWorker;
    if (workName === 'processList') {
        createWorker = await import(`@/main/worker/processList.js?nodeWorker`)
       //?nodeWorker 不支持变量
    }
    return new Promise((resolve, reject) => {
        const worker = createWorker.default({ workerData: { args } })
        worker.on('message', resolve)
        worker.on('error', reject)
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
        })
    })
}
