import { JwtPayload, sign } from 'jsonwebtoken';

import createHttpError from 'http-errors';
import { Config } from '../config';
import { RefreshToken } from '../entity/RefreshToken';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
export class TokenService {
    constructor(private readonly refreshTokenRepo: Repository<RefreshToken>) {}
    generateAccessToken(payload: JwtPayload) {
        let secretKey: string;
        if (!Config.PRIVATE_KEY) {
            const err = createHttpError(500, 'cannot access private key');
            return err;
        }
        try {
            secretKey = Config.PRIVATE_KEY!;
            secretKey = Config.PRIVATE_KEY!;
        } catch (error) {
            const err = createHttpError(500, 'Error while reading private key');
            throw err;
        }
        // Generate access token here
        const accessToken = sign(payload, secretKey, {
            expiresIn: '1h',
            algorithm: 'RS256',
            issuer: 'auth-service',
        });
        return accessToken;
    }
    generateRefreshToken(payload: JwtPayload) {
        if (!Config.RefreshToken_SecretKey) {
            return null;
        }
        return sign(payload, Config.RefreshToken_SecretKey, {
            expiresIn: '1y',
            algorithm: 'HS256',
            issuer: 'auth-service',
            jwtid: String(payload.id),
        });
    }
    async persistRefreshToken(user: User) {
        const newRefreshToken: RefreshToken = await this.refreshTokenRepo.save({
            user: user,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000 * 24 * 365), // 1y
        });
        return newRefreshToken;
    }
    async deleteRefreshToken(id: number) {
        const refreshToken = await this.refreshTokenRepo.findOne({
            where: {
                id,
            },
        });
        if (!refreshToken) {
            throw createHttpError(
                401,
                `Refresh token not found ${refreshToken}`,
            );
        }
        await this.refreshTokenRepo.remove(refreshToken);
        return true;
    }
}
