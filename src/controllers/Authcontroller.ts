import { NextFunction, Response } from 'express';
import { Authrequest, RegisterUserRequest, Reqpayload } from '../types';
import { UserService } from '../services/UserServices';
import { Roles } from '../constants';
import { log } from 'console';
import { validationResult } from 'express-validator';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from '../services/TokenService';
import createHttpError from 'http-errors';
import { CredentialsService } from '../services/CrendentialService';
import logger from '../config/logger';
export class AuthController {
    constructor(
        private readonly userservice: UserService,
        private readonly TokenService: TokenService,
        private readonly crendialservice: CredentialsService,
    ) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const { firstName, lastName, email, password } = req.body;

        try {
            const responseUser = await this.userservice.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.CUSTOMER,
            });
            const payload: JwtPayload = {
                sub: String(responseUser.id),
                role: responseUser.role,
            };

            // access token generate
            const accessToken = this.TokenService.generateAccessToken(payload);
            // new refresh token generate and persist in db
            const newRefreshToken =
                await this.TokenService.persistRefreshToken(responseUser);
            const refreshToken = this.TokenService.generateRefreshToken({
                ...payload,
                id: newRefreshToken.id,
            });

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                expires: new Date(Date.now() + 60 * 60 * 1000), // 1h
                httpOnly: true,
            });
            res.status(201).cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 365), // 1y
                httpOnly: true,
            });
            res.status(201).json({ id: responseUser.id });
        } catch (error) {
            next(error);
        }
    }
    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (result === undefined) {
            logger.error('Validation error');
        }
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const { email, password } = req.body;
        const user = await this.userservice.findByEmail(email);
        if (!user) {
            const error = createHttpError(400, 'Invalid username or password');
            return next(error);
        }
        const isMatch = this.crendialservice.isMatch(password, user.password);
        if (!isMatch) {
            const error = createHttpError(400, 'Invalid username or password');
            return next(error);
        }
        try {
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };
            // access token generate
            const accessToken = this.TokenService.generateAccessToken(payload);
            // new refresh token generate and persist in db
            const newRefreshToken =
                await this.TokenService.persistRefreshToken(user);
            const refreshToken = this.TokenService.generateRefreshToken({
                ...payload,
                id: newRefreshToken.id,
            });
            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                expires: new Date(Date.now() + 60 * 60 * 1000), // 1h
                httpOnly: true,
            });
            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 365), // 1y
                httpOnly: true,
            });
            res.json({ id: user.id });
        } catch (error) {
            return next(error);
        }
    }
    async self(req: Authrequest, res: Response) {
        const user = await this.userservice.findById(Number(req.auth.sub));
        logger.info('han agya hn me yahan');
        res.json({
            ...user,
            password: 'undefined',
        });
    }
    async refresh(req: Reqpayload, res: Response, next: NextFunction) {
        const { role, sub, id } = req.auth;
        try {
            const user = await this.userservice.findById(sub);
            if (!user) {
                const error = createHttpError(
                    400,
                    'Invalid username or password',
                );
                return next(error);
            }
            const payload: JwtPayload = {
                sub: String(sub),
                role: role,
            };
            // access token generate
            const accessToken = this.TokenService.generateAccessToken(payload);
            // new refresh token generate and persist in db
            const newRefreshToken =
                await this.TokenService.persistRefreshToken(user);
            const refreshToken = this.TokenService.generateRefreshToken({
                ...payload,
                id: newRefreshToken.id,
            });
            await this.TokenService.deleteRefreshToken(Number(id));
            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                expires: new Date(Date.now() + 60 * 60 * 1000), // 1h
                httpOnly: true,
            });
            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 365), // 1y
                httpOnly: true,
            });
            res.json({ id: user.id });
        } catch (error) {
            return next(error);
        }
    }

    async logout(req: Reqpayload, res: Response, next: NextFunction) {
        const refreshToken = await this.TokenService.deleteRefreshToken(
            Number(req.auth.id),
        );
        log(refreshToken);
        if (!refreshToken) {
            const error = createHttpError(401, 'Invalid refresh token');
            return next(error);
        }
        res.clearCookie('accessToken', { domain: 'localhost' });
        res.clearCookie('refreshToken', { domain: 'localhost' });
        return res.status(200).json({ message: 'Logged out successfully' });
    }
}
