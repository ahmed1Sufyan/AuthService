/* eslint-disable @typescript-eslint/no-misused-promises */
import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express';
// import { UserController } from '../controllers/UserController';
// import { UserService } from '../services/UserServices';
import { AppDataSource } from '../config/data-source';
// import { User } from '../entity/User';
import logger from '../config/logger';
// import { canAccess } from '../middlewares/canAccess';
// import { Roles } from '../constants';
import userPaginate from '../validators/user-paginate';
import Authenticate from '../middlewares/Authenticate';
import { CompanyReviewController } from '../controllers/CompanyReviewcontroller';
import { CompanyReviewService } from '../services/CompanyReviewService';
import { CompanyReview } from '../entity/Companyreview';
const reviewRoutes = express.Router();

const reviewRepo = AppDataSource.getRepository(CompanyReview);
const reviewService = new CompanyReviewService(reviewRepo, logger);
const reviewController = new CompanyReviewController(reviewService, logger);
reviewRoutes.post(
    '/',
    Authenticate as RequestHandler,
    userPaginate,
    (req: Request, res: Response, next: NextFunction) =>
        reviewController.create(req, res, next),
);
reviewRoutes.get(
    '/',
    Authenticate as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        reviewController.getAll(req, res, next),
);
// reviewRoutes.patch(
//     '/:id',
//     Authenticate as RequestHandler,
//     canAccess([Roles.ADMIN]),
//     (req: Request, res: Response, next: NextFunction) =>
//         userController.update(req, res, next),
// );
// reviewRoutes.delete(
//     '/:id',
//     Authenticate as RequestHandler,
//     canAccess([Roles.ADMIN]),
//     (req: Request, res: Response, next: NextFunction) =>
//         userController.destroy(req, res, next),
// );

export default reviewRoutes;
