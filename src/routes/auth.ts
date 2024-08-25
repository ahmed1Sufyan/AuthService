import express, { NextFunction, Request, Response } from 'express';
import { AuthController } from '../controllers/Authcontroller';
import { UserService } from '../services/UserServices';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { TokenService } from '../services/TokenService';
import { RefreshToken } from '../entity/RefreshToken';
import registerValidators from '../validators/register-validators';
import loginValidators from '../validators/login-validators';
import { CredentialsService } from '../services/CrendentialService';
import { authenticate } from '../middlewares/Authenticate';
import { Authrequest, Reqpayload } from '../types';
import ValidateRefreshToken from '../middlewares/ValidateRefreshToken';
const authRoutes = express.Router();

const userRepo = AppDataSource.getRepository(User);
const RefreshtokenRepo = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(RefreshtokenRepo);
const userservice = new UserService(userRepo);
const crendialservice = new CredentialsService();
const auth = new AuthController(userservice, tokenService, crendialservice);
authRoutes.post(
    '/register',
    registerValidators,
    (req: Request, res: Response, next: NextFunction) =>
        void auth.register(req, res, next),
);
authRoutes.post(
    '/login',
    loginValidators,
    (req: Request, res: Response, next: NextFunction) =>
        void auth.login(req, res, next),
);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
authRoutes.get('/self', authenticate, (req: Request, res: Response) => {
    void auth.self(req as Authrequest, res);
});
authRoutes.post(
    '/refresh',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ValidateRefreshToken,
    (req: Request, res: Response, next: NextFunction) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        auth.refresh(req as Reqpayload, res, next);
    },
);
authRoutes.get(
    '/logout',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ValidateRefreshToken,
    (req: Request, res: Response, next: NextFunction) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        auth.logout(req as Reqpayload, res, next);
    },
);

export default authRoutes;
