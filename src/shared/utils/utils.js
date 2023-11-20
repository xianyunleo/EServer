//通用且与项目无关的方法

export function enumGetName(enumObj, val) {
    let names = Object.keys(enumObj);
    for (const name of names) {
        if (enumObj[name] === val) {
            return name;
        }
    }
}

export function parseTemplateStrings(str, argObj) {
    return str.replace(/\${(.+?)}/g, (match, p1) => argObj[p1] ?? '');
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
    return str.replaceAll("\\", "/")
}

export function getFileSizeText(byte, defaultVal = 0) {
    byte = byte ? byte : defaultVal
    if (byte > 1024 * 1024) {
        return parseInt(byte / (1024 * 1024)) + 'MB'
    }
    return parseInt(byte / 1024) + 'KB'
}
