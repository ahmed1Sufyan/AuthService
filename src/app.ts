import 'reflect-metadata';
import express from 'express';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';
import tenantRoutes from './routes/tenant';
import cors from 'cors';
import userRoutes from './routes/user';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import reviewRoutes from './routes/review';
import jobseekerRouter from './routes/jobSeekerRoutes';
const app = express();

app.use(
    cors({
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true,
    }),
);
// app.use(express.static(path.join(__dirname, '../public')));
// app.use(bodyparser.json( { limit: '50mb' }));
// app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use('/auth', authRoutes);
app.use('/tenants', tenantRoutes);
app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/jobseeker', jobseekerRouter);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(globalErrorHandler);
export default app;
