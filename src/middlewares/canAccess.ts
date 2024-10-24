import { NextFunction, Request, Response } from 'express';
import { Reqpayload } from '../types';
import createHttpError from 'http-errors';
import { log } from 'console';

export const canAccess = (permission: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // yahan pe request ki jaga Reqpayload use krne pe routes file me jb is func ko
        // as a middleware inject kr rhe h tw error derha h lekin Reqpayload hatakr request
        // rehne dete h tw sahi h lekin niche ""req as Reqpayload"" use krna parega

        log('aya');
        const _req = req as Reqpayload;
        const isAdmin = _req.auth.role;
        if (!permission.includes(isAdmin)) {
            const error = createHttpError(403, 'Permission denied');
            return next(error);
        }
        next();
    };
};
