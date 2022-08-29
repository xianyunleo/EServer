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
    return str.replace(/\${(.+?)}/g, (match, p1) => argObj[p1]);
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
