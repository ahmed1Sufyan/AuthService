import { Request } from 'express';
import { Config } from '../config';

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}
export interface RegisterUserRequest extends Request {
    body: UserData;
}
export const user = {
    firstName: Config.firstName,
    lastName: Config.lastName,
    email: Config.email,
    password: Config.password,
    role: Config.role,
};
export const user1 = {
    email: 'testuser@example.com',
    password: 'testpassword1',
};
export interface Authrequest extends Request {
    auth: {
        sub: number;
        role: string;
    };
    user: string;
}
export type AuthCookie = {
    refreshToken: string;
};
export interface IRefreshToken {
    id: string;
}
export interface Reqpayload extends Request {
    auth: {
        sub: number;
        role: string;
        id: number;
    };
}
export interface ITenant {
    name: string;
    address: string;
}
export interface ItenantRequest extends Request {
    body: ITenant;
}
export interface IdReq extends Request {
    body: {
        id: number;
    };
}
export interface Query {
    currentPage: number;
    perPage: number;
    q: string;
    role: string;
}
