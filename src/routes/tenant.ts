import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express';
import { TenantController } from '../controllers/TenantController';
import { TenantService } from '../services/TenantService';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenant';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import userPaginate from '../validators/user-paginate';
import Authenticate from '../middlewares/Authenticate';
const tenantRoutes = express.Router();
const tenantRepo = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepo);
const TenController = new TenantController(tenantService);

tenantRoutes.post(
    '/',
    Authenticate as RequestHandler,
    canAccess([Roles.ADMIN, Roles.JOB_SEEKER]),
    (req: Request, res: Response, next: NextFunction) =>
        void TenController.create(req, res, next),
);
tenantRoutes.get(
    '/getAll',
    Authenticate as RequestHandler,
    // canAccess([Roles.ADMIN]),
    userPaginate,
    (req: Request, res: Response, next: NextFunction) =>
        void TenController.getAll(req, res, next),
);
tenantRoutes.get(
    '/:id',
    Authenticate as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        void TenController.getById(req, res, next),
);
tenantRoutes.put(
    '/:id',
    Authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        void TenController.updateById(req, res, next),
);
tenantRoutes.delete(
    '/:id',
    Authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        void TenController.updateById(req, res, next),
);

export default tenantRoutes;
