import {Modal} from 'ant-design-vue';
import {createVNode} from "vue";

export default class MessageBox {
    /**
     *
     * @param message {string}
     * @param title {string}
     * @returns {Promise<boolean>}
     */
    static async info(message, title) {
        title = title ?? '信息提示';
        let options = {
            title: title,
            content: createVNode('div', {innerHTML: message.replaceAll("\n", "<br/>")})
        }
        let result = true;

        await new Promise((resolve, reject) => {
            options = Object.assign(options, {
                centered: true,
                onOk() {
                    resolve(true);
                },
                onCancel() {
                    reject(false);
                },
            })
            Modal.info(options);
        }).catch(() => result = false);

        return result;
    }

    /**
     *
     * @param message {string}
     * @param title {string}
     * @returns {Promise<boolean>}
     */
    static async error(message, title) {
        title = title ?? '错误提示';
        let options = {
            title: title,
            content: createVNode('div', {innerHTML: message.replaceAll("\n", "<br/>")})
        }
        let result = true;

        await new Promise((resolve, reject) => {
            options = Object.assign(options, {
                centered: true,
                onOk() {
                    resolve(true);
                },
                onCancel() {
                    reject(false);
                },
            })
            Modal.error(options);
        }).catch(() => result = false);

        return result;
    }

    /**
     *
     * @param message {string}
     * @param title {string}
     * @returns {Promise<boolean>}
     */
    static async warning(message, title) {
        title = title ?? '警告提示';
        let options = {
            title: title,
            content: createVNode('div', {innerHTML: message.replaceAll("\n", "<br/>")})
        }
        let result = true;

        await new Promise((resolve, reject) => {
            options = Object.assign(options, {
                centered: true,
                onOk() {
                    resolve(true);
                },
                onCancel() {
                    reject(false);
                },
            })
            Modal.warning(options);
        }).catch(() => result = false);

        return result;
    }

    /**
     * @param options {object}
     * @returns {Promise<boolean>}
     */
    static async confirm(options={}) {
        options.title = options.title ?? '提示';
        if (typeof options.content === 'string') {
            options.content = createVNode('div', {innerHTML: options.content?.replaceAll("\n", "<br/>")})
        }
        let result = true;

        await new Promise((resolve, reject) => {
            options = Object.assign(options, {
                centered: true,
                onOk() {
                    resolve(true);
                },
                onCancel() {
                    reject(false);
                },
            })
            Modal.confirm(options);
        }).catch(() => result = false);

        return result;
    }
}
