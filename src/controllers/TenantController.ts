import { NextFunction, Request, Response } from 'express';
import { ItenantRequest } from '../types';
import createHttpError from 'http-errors';
import { TenantService } from '../services/TenantService';

export class TenantController {
    constructor(private tenantService: TenantService) {}
    // Implement methods for managing tenant-specific routes and actions
    async create(req: ItenantRequest, res: Response, next: NextFunction) {
        // Retrieve and return list of tenants

        const { name, address } = req.body;
        if (!name || !address) {
            const error = createHttpError(400, 'Name and address are required');
            return next(error);
        }
        // Create a new tenant and return the created tenant
        try {
            const createTenant = await this.tenantService.create({
                name,
                address,
            });
            res.status(201).json({
                id: createTenant.id,
            });
        } catch (error) {
            return next(error);
        }
    }
    async getAll(req: Request, res: Response, next: NextFunction) {
        // Implement logic to retrieve and return list of tenants
        try {
            const tenantRepo = await this.tenantService.getAll();
            res.status(201).json(tenantRepo); // Placeholder for actual implementation
        } catch (error) {
            next(error);
        }
    }
    async getById(req: Request, res: Response, next: NextFunction) {
        interface idReq extends Request {
            body: {
                id: number;
            };
        }
        // Implement logic to retrieve and return list of tenants
        const tenantId = req.params.id;
        if (isNaN(Number(tenantId))) {
            const error = createHttpError(400, 'Invalid tenant id');
            return next(error);
        }
        // Retrieve a tenant by id and return it
        try {
            const tenantRepo = await this.tenantService.getById(
                Number(tenantId),
            );
            if (!tenantRepo) {
                next(createHttpError(400, 'Tenant does not exist.'));
                return;
            }
            res.status(201).json(tenantRepo); // Placeholder for actual implementation
        } catch (error) {
            next(error);
        }
        try {
            const tenantRepo = await this.tenantService.getById(
                (req as idReq).body.id,
            );
            res.status(201).json(tenantRepo); // Placeholder for actual implementation
        } catch (error) {
            next(error);
        }
    }
    async updateById(req: ItenantRequest, res: Response, next: NextFunction) {
        // Implement logic to update a tenant by id and return the updated tenant
        const tenantId = req.params.id;
        if (isNaN(Number(tenantId))) {
            const error = createHttpError(400, 'Invalid tenant id');
            return next(error);
        }
        const { name, address } = req.body;
        if (!name || !address) {
            const error = createHttpError(400, 'Name and address are required');
            return next(error);
        }
        // Update a tenant by id and return the updated tenant
        try {
            const updatedTenant = await this.tenantService.updateById(
                Number(tenantId),
                { name, address },
            );
            res.status(201).json(updatedTenant);
        } catch (error) {
            next(error);
        }
    }
}
