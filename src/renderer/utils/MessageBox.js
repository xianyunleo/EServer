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
}
