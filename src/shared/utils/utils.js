//通用且与项目无关的方法

export function extendPrototype() {
    /**
     * 将反斜杠替换成正斜杠
     * @returns {string}
     */
    String.prototype.replaceSlash = function () {
        return this.replaceAll('\\', '/')
    }

    /**
     * 筛选数组，根据 async callback
     * @param asyncFunc
     * @returns {Promise<*[]>}
     */
    Array.prototype.filterAsync = async function (asyncFunc) {
        const results = await Promise.all(this.map(async (item) => {
            const include = await asyncFunc(item)
            return { item, include }
        }))
        return results.filter((v) => v.include).map((v) => v.item)
    }
}

export function enumGetName(enumObj, val) {
    let names = Object.keys(enumObj);
    for (const name of names) {
        if (enumObj[name] === val) {
            return name;
        }
    }
}

/**
 * 将变量名字符串解析成变量值
 * @param varStr {string} 变量名字符串，例如 ${ConfPath}
 * @param varMap {object}
 * @returns {string}
 */
export function parseTemplateStrings(varStr, varMap) {
    return varStr.replace(/\${(.+?)}/g, (match, p1) => varMap[p1] ?? '')
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 将字符串里的所有反斜杠替换成正斜杠
 * @param str {string}
 * @returns {string}
 */
export function replaceSlash(str) {
    return str.replaceAll('\\', '/')
}

export function getFileSizeText(byte, defaultVal = 0) {
    byte = byte ? byte : defaultVal
    if (byte > 1024 * 1024) {
        return (byte / (1024 * 1024)).toFixed(1) + 'MB'
    }
    return parseInt(byte / 1024) + 'KB'
}

export function isRendererProcess() {
    return process.type === 'renderer'
}

/**
 *
 * @param error {Error}
 * @returns {Error}
 */
export function getIpcError(error) {
    const regx = /':\s(\w*Error):\s(.*)/
    const match = error.message.match(regx)
    const err = new Error(match[2])
    err.name = match[1]
    return err
}
