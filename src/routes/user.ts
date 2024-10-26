/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { NextFunction } from 'express-serve-static-core';
import { UserService } from '../services/UserServices';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import { authenticate } from '../middlewares/Authenticate';
import userPaginate from '../validators/user-paginate';
const userRoutes = express.Router();

const userRepo = AppDataSource.getRepository(User);
const userService = new UserService(userRepo);
const userController = new UserController(userService, logger);
userRoutes.get(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    userPaginate,
    (req: Request, res: Response, next: NextFunction) =>
        userController.getAll(req, res, next),
);
userRoutes.get(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        userController.getOne(req, res, next),
);
userRoutes.patch(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        userController.update(req, res, next),
);
userRoutes.delete(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        userController.destroy(req, res, next),
);

export default userRoutes;
