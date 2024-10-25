/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/UserServices';
import { Roles } from '../constants';
import createHttpError from 'http-errors';
import { Logger } from 'winston';
import { matchedData, validationResult } from 'express-validator';
import { IdReq, RegisterUserRequest, useQuery } from '../types';
import { log } from 'console';

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async create(req: RegisterUserRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, email, password } = req.body;
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.MANAGER,
            });
            res.status(201).json({ id: user.id });
        } catch (err) {
            next(err);
        }
    }

    update(req: IdReq, res: Response, next: NextFunction) {
        // In our project: We are not allowing user to change the email id since it is used as username
        // In our project: We are not allowing admin user to change others password

        // Validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        return res.status(400).json({
            msg: 'Maintenance failed',
        });
        // const { firstName, lastName, role } = req.body;
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }

        this.logger.debug('Request for updating a user', req.body);

        try {
            // await this.userService.update(Number(userId), {
            //     firstName,
            //     lastName,
            //     role,
            // });

            this.logger.info('User has been updated', { id: userId });

            res.json({ id: Number(userId) });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const validateQuery = matchedData(req, { onlyValidData: true });
        log(validateQuery);
        try {
            const [users, count] = await this.userService.getAll(
                validateQuery as useQuery,
            );
            this.logger.info('All users have been fetched');
            res.json({
                message: 'All User have been fetched successfully',
                currentPage: validateQuery.currentPage,
                perPage: validateQuery.perPage,
                total: count,
                data: users,
            });
        } catch (err) {
            next(err);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }

        try {
            const user = await this.userService.findById(Number(userId));

            if (!user) {
                next(createHttpError(400, 'User does not exist.'));
                return;
            }

            this.logger.info('User has been fetched', { id: user.id });
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }

        try {
            await this.userService.deleteById(Number(userId));

            this.logger.info('User has been deleted', {
                id: Number(userId),
            });
            res.json({ id: Number(userId) });
        } catch (err) {
            next(err);
        }
    }
}
