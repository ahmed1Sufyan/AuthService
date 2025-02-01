import { Brackets, Repository } from 'typeorm';
import { User } from '../entity/User';
import { Query, UserData, UserOrJobSeeker } from '../types';
import createHttpError from 'http-errors';
// import { Roles } from '../constants';
import bcrypt from 'bcrypt';
import { log } from 'console';
import logger from '../config/logger';
import { JobSeekerProfile } from '../entity/JobSeeker';
import { AppDataSource } from '../config/data-source';
export class UserService {
    constructor(private readonly userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        const user = await this.userRepository.findOne({ where: { email } });
        console.log('user', user);

        if (user) {
            const error = createHttpError(400, 'Email is already exists!');
            throw error;
        }
        const saltrounds = 10;
        password = await bcrypt.hash(password, saltrounds);
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password,
            });
        } catch (err) {
            logger.info(err);
            const error = createHttpError(
                500,
                'Unable to store the data in the database',
            );
            throw error;
        }
    }
    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }
    async findById(id: number) {
        return await this.userRepository.findOne({
            where: { id },
            relations: [
                'jobSeekerProfile',
                'jobSeekerProfile.workExperience',
                'jobSeekerProfile.education',
                'jobSeekerProfile.certifications',
                'jobSeekerProfile.projects',
                'jobSeekerProfile.testimonials',
                'jobSeekerProfile.achievements',
                'jobSeekerProfile.languages',
            ],
        });
    }

    async update(
        id: number,
        data: UserOrJobSeeker,
        seekerdata?: JobSeekerProfile,
    ) {
        await AppDataSource.transaction(async (transactionalEntityManager) => {
            if (!data.jobSeekerProfile) {
                // Create a new JobSeekerProfile
                const seekerProfile = transactionalEntityManager.create(
                    JobSeekerProfile,
                    seekerdata as JobSeekerProfile,
                );
                const savedSeekerProfile =
                    await transactionalEntityManager.save(
                        JobSeekerProfile,
                        seekerProfile,
                    );
                data.jobSeekerProfile = savedSeekerProfile;
            } else {
                // Update the existing JobSeekerProfile
                await transactionalEntityManager.update(
                    JobSeekerProfile,
                    Number(data.jobSeekerProfile),
                    seekerdata as JobSeekerProfile,
                );
            }

            // Update the User entity
            await transactionalEntityManager.update(User, id, data);
        });

        return { message: 'User and JobSeeker updated successfully' };
    }

    async getAll(validateQuery: Query) {
        const queryBuilder = this.userRepository.createQueryBuilder('users');

        if (validateQuery.q) {
            const search = `%${validateQuery.q}%`;
            queryBuilder.where(
                new Brackets((qb) => {
                    qb.where(
                        `CONCAT(users.firstName, ' ', users.lastName) ILIKE :q`,
                        {
                            q: search,
                        },
                    ).orWhere('users.email ILIKE :q', { q: search });
                }),
            );
        }
        if (validateQuery.role) {
            queryBuilder.andWhere('users.role = :role', {
                role: validateQuery.role,
            });
        }
        const result = await queryBuilder
            .leftJoinAndSelect('users.tenant', 'tenant')
            .skip((validateQuery.currentPage - 1) * validateQuery.perPage)
            .take(validateQuery.perPage)
            .orderBy('users.id', 'DESC')
            .getManyAndCount();

        log('query builder', queryBuilder.getSql());
        return result;
    }

    async deleteById(userId: number) {
        return await this.userRepository.delete(userId);
    }
}
