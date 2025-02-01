import { Repository } from 'typeorm';
import { CompanyReview } from '../entity/Companyreview';
// import { Tenant } from "../entity/Tenant"
// import { User } from "../entity/User"
import { Logger } from 'winston';
import { Review } from '../types';

export class CompanyReviewService {
    constructor(
        private readonly companyReviewRepository: Repository<CompanyReview>,
        // private readonly tenantRepository: Repository<Tenant>,
        // private readonly userRepository: Repository<User>,
        // private readonly reviewReactionRepository: Repository<ReviewReaction>,
        private readonly logger: Logger,
    ) {}

    async create(data: Review) {
        return await this.companyReviewRepository.save(
            data as unknown as CompanyReview,
        );
    }
    async update(reviewId: number, data: CompanyReview) {
        return await this.companyReviewRepository.update(reviewId, data);
    }
    async delete(reviewId: number) {
        return await this.companyReviewRepository.delete(reviewId);
    }
    async getById(reviewId: number) {
        return await this.companyReviewRepository.findOne({
            where: { id: reviewId },
        });
    }
    async getAll() {
        return await this.companyReviewRepository.find({
            relations: ['user', 'company', 'reactions'],
        });
    }
}
