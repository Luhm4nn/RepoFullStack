import * as yup from 'yup';

export const qrValidationSchema = yup.object({
    encryptedData: yup
        .string()
        .required('Los datos encriptados del QR son requeridos'),
});
