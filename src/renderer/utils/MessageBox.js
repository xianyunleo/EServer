import {Modal} from 'ant-design-vue';

export default class MessageBox {
    static info(message, title) {
        title = title ?? '信息提示';
        Modal.info({
            title: title,
            content: message,
            centered: true,
        });
    }

    static error(message, title) {
        title = title ?? '错误提示';
        Modal.error({
            title: title,
            content: message,
            centered: true,
        });
    }

    static Warning(message, title) {
        title = title ?? '警告提示';
        Modal.warning({
            title: title,
            content: message,
            centered: true,
        });
    }

    /**
     * @param options
     * @returns {Promise<boolean>}
     */
    static async Confirm(options={}) {
        options.title = options.title ?? '提示';
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
