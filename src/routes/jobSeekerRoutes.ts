/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import {
    Achievement,
    Certification,
    Education,
    JobSeekerProfile,
    LanguageProficiency,
    Location,
    Project,
    Testimonial,
    WorkExperience,
} from '../entity/JobSeeker';
import JobSeekerServices from '../services/jobseekerService';
import JobSeekerController from '../controllers/JobSeekerController';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';

const jobseekerRouter = Router();

const jobseekerRepo = AppDataSource.getRepository(JobSeekerProfile);
const EducationrRepo = AppDataSource.getRepository(Education);
const WorkExperienceRepo = AppDataSource.getRepository(WorkExperience);
const ProjectRepo = AppDataSource.getRepository(Project);
const TestimonialRepo = AppDataSource.getRepository(Testimonial);
const AchievementRepo = AppDataSource.getRepository(Achievement);
const CertificationRepo = AppDataSource.getRepository(Certification);
const LanguageProficiencyRepo =
    AppDataSource.getRepository(LanguageProficiency);
const LocationRepo = AppDataSource.getRepository(Location);
const user = AppDataSource.getRepository(User);

const jobseekerservice = new JobSeekerServices(
    jobseekerRepo,
    ProjectRepo,
    TestimonialRepo,
    AchievementRepo,
    CertificationRepo,
    LanguageProficiencyRepo,
    WorkExperienceRepo,
    EducationrRepo,
    LocationRepo,
    user,
);
const jobseekerController = new JobSeekerController(jobseekerservice);

jobseekerRouter.post(
    '/:id',
    async (req, res, next) =>
        await jobseekerController.createProfile(req, res, next),
);
jobseekerRouter.get('/', (req, res, next) =>
    jobseekerController.getProfiles(req, res, next),
);
jobseekerRouter.get('/:id', (req, res, next) =>
    jobseekerController.getProfile(req, res, next),
);

jobseekerRouter.delete('/:id', (req, res, next) =>
    jobseekerController.deleteProfile(req, res, next),
);

jobseekerRouter.put('/:id', (req, res, next) =>
    jobseekerController.updateProfile(req, res, next),
);

export default jobseekerRouter;
