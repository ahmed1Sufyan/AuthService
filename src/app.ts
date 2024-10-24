import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import logger from './config/logger';
import { HttpError } from 'http-errors';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';
import tenantRoutes from './routes/tenant';
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use('/auth', authRoutes);
app.use('/tenants', tenantRoutes);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof Error) logger.error(err.message);
    const statuscode = err.statusCode || err.status || 500;
    res.status(statuscode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    });
});
export default app;
