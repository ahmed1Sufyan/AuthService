import { Brackets, Repository } from 'typeorm';
import { User } from '../entity/User';
import { useQuery, UserData } from '../types';
import createHttpError from 'http-errors';
import { Roles } from '../constants';
import bcrypt from 'bcrypt';
import { log } from 'console';
export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        const user = await this.userRepository.findOne({ where: { email } });
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
                role: Roles.CUSTOMER,
            });
        } catch (err) {
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
            relations: {
                tenant: true,
            },
        });
    }
    async update() {
        // { firstName, lastName, role }: LimitedUserData, // userId: number,
        // try {
        //     return await this.userRepository.update(userId, {
        //         firstName,
        //         lastName,
        //         role,
        //     });
        // } catch (err) {
        //     const error = createHttpError(
        //         500,
        //         "Failed to update the user in the database",
        //     );
        //     throw error;
        // }
    }

    async getAll(validateQuery: useQuery) {
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
