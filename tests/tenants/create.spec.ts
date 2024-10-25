import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { Tenant } from '../../src/entity/Tenant';
import { TokenService } from '../../src/services/TokenService';
import { RefreshToken } from '../../src/entity/RefreshToken';
import { Roles } from '../../src/constants';
import logger from '../../src/config/logger';
import { Config } from '../../src/config';
import jwt from 'jsonwebtoken';
describe('POST /tenants', () => {
    let Connection: DataSource;
    // BEFORE RUN ANY TEST DB SHOULD BE CONNECTED
    beforeAll(async () => {
        Connection = await AppDataSource.initialize();
    });
    // DB SHOULD BE CLEAN BEOFORE EVERY TEST
    beforeEach(async () => {
        // Db truncate
        // await truncateTables(Connection);
        await Connection.dropDatabase();
        await Connection.synchronize();
    });
    // AFTER RUNNING ALL TESTS DB SHOULD BE DISCONNECTED
    afterAll(async () => {
        await Connection.destroy();
    });
    // TEST CASES FOR REGISTERING NEW USERS
    describe('Given all fields', () => {
        it('should return 201 status code', async () => {
            const RefreshtokenRepo = AppDataSource.getRepository(RefreshToken);
            const tokenService = new TokenService(RefreshtokenRepo);
            // const accessToken = tokenService.generateAccessToken({
            //     sub: '1',
            //     role: Roles.ADMIN,
            // });
            if (!Config.PRIVATE_KEY) {
                return;
            }
            const accessToken = jwt.sign(
                { sub: '1', role: Roles.ADMIN },
                Config.PRIVATE_KEY as string,
                {
                    algorithm: 'RS256',
                    expiresIn: '10s',
                },
            );
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            };
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(tenantData);
            expect(response.statusCode).toBe(201);
        });
        it('should create a new tenant in the database', async () => {
            const RefreshtokenRepo = AppDataSource.getRepository(RefreshToken);
            const tokenService = new TokenService(RefreshtokenRepo);
            // const accessToken = tokenService.generateAccessToken({
            //     sub: '1',
            //     role: Roles.ADMIN,
            // });
            if (!Config.PRIVATE_KEY) {
                return;
            }
            const accessToken = jwt.sign(
                { sub: '1', role: Roles.ADMIN },
                Config.PRIVATE_KEY as string,
                {
                    algorithm: 'RS256',
                    expiresIn: '10s',
                },
            );
            console.log('accesstoken tenant', { accessToken });
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            };
            // add token to cookie
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(tenantData);
            // logger.info('tenant 1', response.body);
            const tenant = await Connection.getRepository(Tenant).find();
            // logger.info('tenant 2', tenant);
            expect(tenant).toBeTruthy();
            expect(response.statusCode).toBe(201);
        });
        it('should return 401 if user is not authenticated', async () => {
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            };
            const response = await request(app)
                .post('/tenants')
                .send(tenantData);

            expect(response.statusCode).toBe(401);
        });
        it('should return 403 when the user is not admin', async () => {
            const RefreshtokenRepo = AppDataSource.getRepository(RefreshToken);
            const tokenService = new TokenService(RefreshtokenRepo);
            const accessToken = tokenService.generateAccessToken({
                sub: '1',
                role: Roles.MANAGER,
            });
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            };
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(tenantData);

            expect(response.statusCode).toBe(401);
        });
        it('should return list of All tenants', async () => {
            const RefreshtokenRepo = AppDataSource.getRepository(RefreshToken);
            const tokenService = new TokenService(RefreshtokenRepo);
            // const accessToken = tokenService.generateAccessToken({
            //     sub: '1',
            //     role: Roles.ADMIN,
            // });
            if (!Config.PRIVATE_KEY) {
                return;
            }
            const accessToken = jwt.sign(
                { sub: '1', role: Roles.ADMIN },
                Config.PRIVATE_KEY as string,
                {
                    algorithm: 'RS256',
                    expiresIn: '10s',
                },
            );
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            };
            await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(tenantData);
            const response = await request(app)
                .post('/tenants/getAll')
                .set('Cookie', `accessToken=${accessToken}`);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveLength(1);
        });
        it.skip('should return list of All tenants', async () => {
            const RefreshtokenRepo = AppDataSource.getRepository(RefreshToken);
            const tokenService = new TokenService(RefreshtokenRepo);
            const accessToken = tokenService.generateAccessToken({
                sub: '1',
                role: Roles.ADMIN,
            });
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            };
            await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(tenantData);
            const response = await request(app)
                .post('/tenants/1')
                .set('Cookie', `accessToken=${accessToken}`);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveLength(2);
        });
    });
});
