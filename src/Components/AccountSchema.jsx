import * as yup from 'yup';

export const AccountSchema = yup.object().shape({
    username: yup.string().required('Adınızı daxil edin').min(3, 'Adın uzunlugu 3 simvoldan az ola bilməz'),
    email: yup.string().email('Email etibarlı deyil').required('Email daxil edin'),
    registerPassword: yup.string().required('Şifrənizi daxil edin').min(6, 'Şifrənizin uzunluğu 6 simvoldan az ola bilməz')
})