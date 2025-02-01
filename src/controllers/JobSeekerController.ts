import { Education, WorkExperience } from '../entity/JobSeeker';
import JobSeekerServices from '../services/jobseekerService';
import { Request, Response, NextFunction } from 'express';
import { JobseekerInterface, Profile } from '../types';
import createHttpError from 'http-errors';

export interface SeekerProfile {
    userId: string;
    skills: string[];
    resume: string;
    portfolioUrl: string;
    workExperience: WorkExperience[];
    linkedin: string;
    github: string;
    education: Education[];
}
export default class JobSeekerController {
    constructor(private jobSeekerService: JobSeekerServices) {}
    createProfile = async (
        req: JobseekerInterface,
        res: Response,
        next: NextFunction,
    ) => {
        console.log('end');

        // return res.status(400).json({ message: "Please provide all the required fields" })
        const { id } = req.params;
        const {
            name,
            about,
            achievements,
            avatar,
            certifications,
            education,
            email,
            experience,
            github,
            languages,
            linkedin,
            location,
            phone,
            projects,
            skills,
            testimonials,
            title,
        } = req.body;
        if (!id) {
            return next(createHttpError(404, 'User does not exist'));
        }

        try {
            const resp = await this.jobSeekerService.createJobSeekerProfile(
                {
                    name,
                    about,
                    achievements,
                    avatar,
                    certifications,
                    education,
                    email,
                    experience,
                    github,
                    languages,
                    linkedin,
                    location,
                    phone,
                    projects,
                    skills,
                    testimonials,
                    title,
                } as Profile,
                Number(id),
            );

            res.status(201).json({
                data: resp,
            });
        } catch (error) {
            next(error);
        }
    };
    getProfiles = (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json({
                data: req.body as string,
            });
        } catch (error) {
            next(error);
        }
    };
    getProfile = (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json({
                data: req.body as string,
            });
        } catch (error) {
            next(error);
        }
    };
    deleteProfile = (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json({
                data: req.body as string,
            });
        } catch (error) {
            next(error);
        }
    };
    updateProfile = async (
        req: JobseekerInterface,
        res: Response,
        next: NextFunction,
    ) => {
        console.log(req.body);

        const { id } = req.params;
        const {
            name,
            about,
            achievements,
            avatar,
            certifications,
            education,
            email,
            experience,
            github,
            languages,
            linkedin,
            location,
            phone,
            projects,
            skills,
            testimonials,
            title,
        } = req.body;
        if (!id) {
            return next(createHttpError(404, 'User does not exist'));
        }

        try {
            const resp = await this.jobSeekerService.updateJobSeekerProfile(
                {
                    name,
                    about,
                    achievements,
                    avatar,
                    certifications,
                    education,
                    email,
                    experience,
                    github,
                    languages,
                    linkedin,
                    location,
                    phone,
                    projects,
                    skills,
                    testimonials,
                    title,
                } as Profile,
                Number(id),
            );

            res.status(201).json({
                data: resp,
            });
        } catch (error) {
            next(error);
        }
    };
}
