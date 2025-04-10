import { ErrorMessage } from './interfaces';

export const ERROR_MESSAGES: { [key: string]: ErrorMessage } = {
    user_already_exists: {
        en: 'User already exists',
        ar: 'المستخدم موجود بالفعل',
    },
    user_not_found: {
        en: 'User not found',
        ar: 'المستخدم غير موجود',
    },
    invalid_password: {
        en: 'Invalid password',
        ar: 'كلمة المرور غير صحيحة',
    },
    unauthorized: {
        en: 'Unauthorized',
        ar: 'غير مصرح',
    },
    invalid_token: {
        en: 'Invalid token',
        ar: 'رمز غير صالح',
    },
    no_token_provided: {
        en: 'No token provided',
        ar: 'لم يتم توفير رمز',
    },
    blog_not_found: {
        en: 'Blog not found',
        ar: 'المقالة غير موجودة',
    },
    api_not_found: {
        en: 'API not found',
        ar: 'API غير موجود',
    },
};
