import { Repository } from 'typeorm';
import { Tenant } from '../entity/Tenant';
import { ITenant } from '../types';

export class TenantService {
    // Implement methods for managing tenant entities
    constructor(private tenantRepo: Repository<Tenant>) {}
    async create(tenantData: ITenant) {
        // Implement tenant creation logic here
        return await this.tenantRepo.save(tenantData);
    }
    async getAll() {
        // Implement tenant creation logic here
        return await this.tenantRepo.find();
    }
    async getById(tenantId: number) {
        // Implement tenant creation logic here
        return await this.tenantRepo.findOne({ where: { id: tenantId } });
    }
    async updateById(tenantId: number, tenantData: ITenant) {
        // Implement tenant creation logic here
        return await this.tenantRepo.update(tenantId, tenantData);
    }
}
