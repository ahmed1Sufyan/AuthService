/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, RequestHandler, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { NextFunction } from 'express-serve-static-core';
import { UserService } from '../services/UserServices';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import userPaginate from '../validators/user-paginate';
import Authenticate from '../middlewares/Authenticate';
import fileUpload from 'express-fileupload';
import { S3Storage } from '../common/S3Storage';
// import { JobSeekerProfile } from '../entity/JobSeeker';
const userRoutes = express.Router();

// const seekerRepo =  AppDataSource.getRepository(JobSeekerProfile)
const userRepo = AppDataSource.getRepository(User);
const userService = new UserService(userRepo);
const S3storage = new S3Storage();
const userController = new UserController(userService, logger, S3storage);
userRoutes.get(
    '/',
    Authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    userPaginate,
    (req: Request, res: Response, next: NextFunction) =>
        userController.getAll(req, res, next),
);
userRoutes.get(
    '/:id',
    Authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        userController.getOne(req, res, next),
);
userRoutes.put(
    '/:id',
    // Authenticate as RequestHandler,
    // canAccess([Roles.ADMIN]),
    fileUpload({
        createParentPath: true,
        limits: { fileSize: 10 * 1024 * 1024 },
    }),
    (req: Request, res: Response, next: NextFunction) =>
        userController.update(req, res, next),
);
userRoutes.delete(
    '/:id',
    Authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        userController.destroy(req, res, next),
);

export default userRoutes;
