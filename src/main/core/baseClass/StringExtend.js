export default class StringExtend {
    constructor() {
        this.init();
    }

    static init() {
        //将字符串里的所有反斜杠替换成正斜杠
        String.prototype.replaceSlash = function () {
            console.log('456')
            return this.replaceAll("\\", "/")
        };
    }
}
