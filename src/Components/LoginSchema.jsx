import * as yup from 'yup';

export const LoginSchema = yup.object().shape({
    email: yup.string().email('Email etibarlı deyil').required('Email daxil edin'),
    password: yup.string().required('Şifrənizi daxil edin').min(6, 'Şifrənizin uzunluğu 6 simvoldan az ola bilməz'),
})