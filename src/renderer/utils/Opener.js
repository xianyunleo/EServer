import MainOpener from '@/main/utils/Opener'
import MessageBox from '@/renderer/utils/MessageBox'

export default new Proxy(MainOpener, {
    get: function(target, propKey) {
        // 检查属性是否为函数（静态方法）
        if (typeof target[propKey] === 'function') {
            // 返回一个新的函数，该函数会调用静态方法
            return async (...args) => {
                try {
                    return await target[propKey].apply(target, args)
                } catch (error) {
                    MessageBox.error(error.message)
                }
            }
        }
        return undefined
    }
})
