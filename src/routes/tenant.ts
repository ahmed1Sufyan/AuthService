import express, { NextFunction, Request, Response } from 'express';
import { TenantController } from '../controllers/TenantController';
import { TenantService } from '../services/TenantService';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenant';
import { authenticate } from '../middlewares/Authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
const tenantRoutes = express.Router();
const tenantRepo = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepo);
const TenController = new TenantController(tenantService);

tenantRoutes.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        void TenController.create(req, res, next),
);
tenantRoutes.post(
    '/getAll',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        void TenController.getAll(req, res, next),
);
tenantRoutes.get(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        void TenController.getById(req, res, next),
);
tenantRoutes.put(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        void TenController.updateById(req, res, next),
);

export default tenantRoutes;
