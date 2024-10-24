import { Request } from 'express';
import { Config } from '../config';
import { expressjwt } from 'express-jwt';
import { AuthCookie, IRefreshToken } from '../types';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/RefreshToken';
import logger from '../config/logger';
import { log } from 'console';

export default expressjwt({
    secret: Config.RefreshToken_SecretKey!,
    algorithms: ['HS256'],
    getToken: (req: Request) => {
        const { refreshToken } = req.cookies as AuthCookie;
        return refreshToken;
    },
    async isRevoked(req: Request, token) {
        log(token);
        try {
            const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
            const refreshToken = await refreshTokenRepo.findOne({
                where: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: Number((token?.payload as IRefreshToken).id),
                    user: { id: Number(token?.payload.sub) },
                },
            });
            return refreshToken === null;
        } catch (error) {
            logger.error('Error fetching token from user', error);
        }
        return true;
    },
});
