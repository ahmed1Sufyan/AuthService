import { Logger } from 'winston';
import { CompanyReviewService } from '../services/CompanyReviewService';
import { NextFunction, Request, Response } from 'express';
import { Review } from '../types';
import createHttpError from 'http-errors';

export class CompanyReviewController {
    constructor(
        private readonly companyReviewService: CompanyReviewService,
        private readonly logger: Logger,
    ) {}

    async create(req: Request, res: Response, next: NextFunction) {
        const { company, rating, comment, user } =
            req.body as unknown as Review;

        if (!company || !rating || !comment || !user) {
            return next(
                createHttpError(
                    400,
                    'Company, rating, comment and user are required',
                ),
            );
        }
        try {
            const companyReview = await this.companyReviewService.create({
                company,
                user,
                rating,
                comment,
            });

            res.status(201).json({ id: companyReview.id });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const companyReviews = await this.companyReviewService.getAll();
            res.status(200).json(companyReviews);
        } catch (err) {
            next(err);
        }
    }
    //  update(req: Request, res: Response, next: NextFunction) {
    //     // Validation
    //     const result = validationResult(req);
    //     if (!result.isEmpty()) {
    //         return res.status(400).json({ errors: result.array() });
    //     }
    //     // return res.status(400).json({
    //     //     msg: 'Maintenance failed',
    //     // });
    //     // const { firstName, lastName, role } = req.body;
    //     const reviewId = req.params.id;

    //     if (isNaN(Number(reviewId))) {
    //         next(createHttpError(400, 'Invalid url param.'));
    //         return;
    //     }

    //     this.logger.debug('Request for updating a company review', req.body);

    //     try {
    //         // await this.companyReviewService.update(Number(reviewId), {
    //         //     firstName,
    //         //     lastName,
    //         //     role,
    //         // });
    //         res.status(200).json({
    //             msg: 'Company review updated',
    //         });
    //     } catch (err) {
    //         next(err);
    //     }
    // }

    //  destroy(req: Request, res: Response, next: NextFunction) {
    //     const reviewId = req.params.id;

    //     if (isNaN(Number(reviewId))) {
    //         next(createHttpError(400, 'Invalid url param.'));
    //         return;
    //     }

    //     this.logger.debug('Request for deleting a company review', req.body);

    //     try {
    //         // await this.companyReviewService.destroy(Number(reviewId));
    //         res.status(200).json({
    //             msg: 'Company review deleted',
    //         });
    //     } catch (err) {
    //         next(err);
    //     }
    // }
}
