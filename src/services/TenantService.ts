import { Brackets, Repository } from 'typeorm';
import { Tenant } from '../entity/Tenant';
import { ITenant, Query } from '../types';
import { log } from 'console';

export class TenantService {
    // Implement methods for managing tenant entities
    constructor(private readonly tenantRepo: Repository<Tenant>) {}
    async create(tenantData: ITenant) {
        // Implement tenant creation logic here
        return await this.tenantRepo.save({
            name: tenantData.name,
            adminId: tenantData.adminId,
            address: tenantData.address,
            description: tenantData.description,
            logo: tenantData.logo,
            locations: tenantData.locations,
            type: tenantData.type,
            verificationStatus: tenantData.verificationStatus,
            industry: tenantData.industry,
            size: tenantData.size,
        });
    }
    async getAll(validateQuery: Query) {
        // Implement tenant creation logic here
        const queryBuilder = this.tenantRepo.createQueryBuilder('tenants');
        validateQuery.perPage = 10;
        if (validateQuery.q) {
            const search = `%${validateQuery.q}%`;
            queryBuilder.where(
                new Brackets((qb) => {
                    qb.where(`tenants.name ILIKE :q`, {
                        q: search,
                    }).orWhere('tenants.address ILIKE :q', { q: search });
                }),
            );
        }
        const result = await queryBuilder
            .skip((validateQuery.currentPage - 1) * validateQuery.perPage)
            .take(validateQuery.perPage)
            .orderBy('tenants.id', 'DESC')
            .getManyAndCount();

        log('query builder', queryBuilder.getSql());
        return result;
    }
    async getById(tenantId: number) {
        // Implement tenant creation logic here
        return await this.tenantRepo.find({
            where: { adminId: String(tenantId) },
            relations: ['employers', 'reviews'],
        });
    }
    async updateById(tenantId: number, tenantData: ITenant) {
        // Implement tenant creation logic here
        return await this.tenantRepo.update(tenantId, tenantData);
    }
    async deleteById(tenantId: number) {
        // Implement tenant creation logic here
        return await this.tenantRepo.delete(tenantId);
    }
}
