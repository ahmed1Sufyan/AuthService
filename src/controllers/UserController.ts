/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/UserServices';
import { Roles } from '../constants';
import createHttpError from 'http-errors';
import { Logger } from 'winston';
import { matchedData, validationResult } from 'express-validator';
import {
    RegisterUserRequest,
    Query,
    updateReq,
    UserOrJobSeeker,
} from '../types';
import { log } from 'console';
import { UploadedFile } from 'express-fileupload';
import { FileStorage } from '../types/storage';
import { v4 as uuidv4 } from 'uuid';
import { JobSeekerProfile } from '../entity/JobSeeker';
// import { User } from '../entity/User';
// import { JobSeekerProfile } from '../entity/JobSeeker';
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly logger: Logger,
        private readonly S3Storage: FileStorage,
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

                role: Roles.JOB_EMPLOYER,
            });
            res.status(201).json({ id: user.id });
        } catch (err) {
            next(err);
        }
    }

    async update(req: updateReq, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        console.log(req.body);

        // return res.status(200).json({ errors: req.body });
        const files = req?.files; // `files` is the key from the frontend
        const file = ['profileUrl', 'resume'];
        const resp: string[] = [];
        if (files) {
            const imgs = Object.entries(files).map(([, val]) => {
                return val;
            }) as UploadedFile[];

            for (const img of imgs) {
                const name = `${uuidv4()}.${img.mimetype.split('/')[1]}`;
                resp.push(
                    await this.S3Storage.uploadFile({
                        filename: name,
                        fileData: img.data,
                    }),
                );
            }
        }
        const obj = Object.fromEntries(
            file.map((key, index) => [key, resp[index]]),
        );
        const { firstName, lastName, email } = req.body;
        const {
            jobSeekerProfile,
            skills,
            portfolioUrl,
            workExperience,
            linkedin,
            github,
            education,
        } = req.body;
        // return res.json({ body :  obj});
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }
        const userdata = {
            jobSeekerProfile,
            firstName,
            lastName,
            email,
            ...(obj?.profileUrl && { profileUrl: obj.profileUrl }),
        };
        const jobseekerdata = {
            user: userId,
            skills,
            portfolioUrl,
            workExperience,
            linkedin,
            github,
            education,
            ...(obj.resume && { resume: obj.resume }),
        };
        this.logger.debug('Request for updating a user', req.body);
        try {
            await this.userService.update(
                Number(userId),
                userdata as UserOrJobSeeker,
                jobseekerdata as unknown as JobSeekerProfile,
            );
            this.logger.info('User has been updated', { id: Number(userId) });
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
                validateQuery as Query,
            );
            this.logger.info('All users have been fetched');
            res.json({
                message: 'All User have been fetched successfully',
                currentPage: validateQuery.currentPage as string,
                perPage: validateQuery.perPage as string,
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
