import 'dotenv/config';

const required = (key) => {
    if (!process.env[key]) {
        throw new Error(`Falta variable de entorno: ${key}`);
    }
    return process.env[key];
};

const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    DB_HOST: required('DB_HOST'),
    DB_USER: required('DB_USER'),
    DB_PASSWORD: required('DB_PASSWORD'),
    DB_NAME: required('DB_NAME'),
    JWT_SECRET: required('JWT_SECRET'),
    SMTP_HOST: required('SMTP_HOST'),
    SMTP_PORT: required('SMTP_PORT'),
    SMTP_USER_EMAIL: required('SMTP_USER_EMAIL'),
    SMTP_PASS: required('SMTP_PASS'),
    OTP_EXPIRES_MINUTES: required('OTP_EXPIRES_MINUTES'),
    REFRESH_EXPIRES_DAYS: required('REFRESH_EXPIRES_DAYS'),
    ACCESS_EXPIRES: required('ACCESS_EXPIRES')
};

export default env;


