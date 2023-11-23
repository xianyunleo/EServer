//这个类下的方法主要用于，调用worker
import { callWorker } from '@/main/common/call.js'

export default class ProcessLibrary {
    /**
     * @param options {object}
     * @param options
     * @returns {Promise<[]>}
     */
    static async getList(options = {}) {
        try {
            return await callWorker('processList', options)
        } catch (e) {
            return []
        }
    }
}
