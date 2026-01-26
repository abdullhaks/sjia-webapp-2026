import { App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { NotificationInstance } from 'antd/es/notification/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';

let message: MessageInstance;
let notification: NotificationInstance;
let modal: Omit<ModalStaticFunctions, 'warn'>;

export default function AntdStaticProvider() {
    const staticFunction = App.useApp();
    message = staticFunction.message;
    notification = staticFunction.notification;
    modal = staticFunction.modal;
    return null;
}

export { message, notification, modal };
