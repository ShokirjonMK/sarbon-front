import { notification } from 'antd';


const messgaeTitleSuccess = (type: string) => {
    switch (type) {
        case 'create':
            return "Ma'lumot qo'shildi."
        case 'update':
            return "Ma'lumot o'zgartirildi."
        case 'delete':
            return "Ma'lumot o'chirildi."
        case 'read':
            return "Ma'lumot olindi."
        default:
            return 'Successfully'
    }
}
const messgaeTitleError = (type: string) => {
    switch (type) {
        case 'create':
            return "Ma'lumot qo'shishda xatolik."
        case 'update':
            return "Ma'lumot o'zgartirishda xatolik."
        case 'delete':
            return "Ma'lumot o'chirishda xatolik."
        case 'read':
            return "Ma'lumot olishda xatolik."
        default:
            return 'Error'
    }
}
const messgaeTitleWarning = (type: string) => {
    switch (type) {
        case 'create':
            return "Ogohlantirish."
        case 'update':
            return "Ogohlantirish."
        case 'delete':
            return "Ogohlantirish."
        case 'read':
            return "Ogohlantirish."
        default:
            return 'Warning'
    }
}

export const Notification = (status: 'success' | 'error' | 'warning' | 'info', type: 'create' | 'update' | 'delete' | 'read', description: string) => new Promise((resolve, reject) => {
    const message = messgaeTitleSuccess(type);
    switch (status) {
        case 'success':
            notification.success({ message: messgaeTitleSuccess(type), description, duration: 2 });
            break
        case 'error':
            notification.error({ message: messgaeTitleError(type), description, duration: 2 });
            break
        case 'warning':
            notification.warning({ message: messgaeTitleWarning(type), description, duration: 2 });
            break
        default:
            notification.info({ message, description, duration: 2 });
    }
    resolve('ok')
    reject('error')
})
