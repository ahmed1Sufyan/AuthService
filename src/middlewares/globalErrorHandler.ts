/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import logger from '../config/logger';
import { error } from 'console';
import generateUniqueId from 'generate-unique-id';
export const globalErrorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const id = generateUniqueId();
    const status = err.status || err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    logger.error(err.message, {
        id,
        status,
        error: err.stack,
        path: req.path,
        method: req.method,
    });
    console.error(`Error ID: ${id}, Error: ${err.message}`);
    res.status(status).json({
        errors: [
            {
                ref: id,
                type: error.name,
                msg: err.message,
                path: req.path,
                method: req.method,
                location: 'server',
                stack: isProduction ? null : err.stack,
            },
        ],
    });
};
