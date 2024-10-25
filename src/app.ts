import 'reflect-metadata';
import express from 'express';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';
import tenantRoutes from './routes/tenant';
import cors from 'cors';
import userRoutes from './routes/user';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
const app = express();

app.use(
    cors({
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true,
    }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use('/auth', authRoutes);
app.use('/tenants', tenantRoutes);
app.use('/users', userRoutes);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(globalErrorHandler);
export default app;
