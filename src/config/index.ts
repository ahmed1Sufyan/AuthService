import { config } from 'dotenv';
import path from 'path';
config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV ?? 'dev'}`),
});

const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    RefreshToken_SecretKey,
    PRIVATE_KEY,
    JWKS_URI,
    firstName,
    lastName,
    email,
    password,
    role,
    aws_secrect_access_key,
    aws_access_key,
    aws_region,
} = process.env;
// console.log(process.env);

export const Config = {
    firstName,
    lastName,
    email,
    password,
    role,
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    PRIVATE_KEY,
    RefreshToken_SecretKey,
    JWKS_URI,
    aws_secrect_access_key,
    aws_access_key,
    aws_region,
};
