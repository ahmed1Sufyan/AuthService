import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { Tenant } from '../../src/entity/Tenant';
import { TokenService } from '../../src/services/TokenService';
import { RefreshToken } from '../../src/entity/RefreshToken';
import { Roles } from '../../src/constants';
import { log } from 'console';

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
            const accessToken = tokenService.generateAccessToken({
                sub: '1',
                role: Roles.ADMIN,
            });
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            };
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(tenantData);
            // log(response.body);
            expect(response.statusCode).toBe(201);
        });
        // it.skip('should return valid json response', async () => {});
        it('should create a new tenant in the database', async () => {
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
            // add token to cookie
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(tenantData);
            // log(response);
            const tenant = await Connection.getRepository(Tenant).find();
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
            //.expect((response) => {
            //     expect(response.body).toEqual({
            //         message: 'Unauthorized',
            //     });
            // });
            //.expect('WWW-Authenticate', 'Bearer realm="jwt"');
            //.expect('X-Content-Type-Options', 'nosniff');
            //.expect('X-Frame-Options', 'DENY');
            //.expect('X-XSS-Protection', '1; mode=block');
            //.expect('Content-Security-Policy',
            //     "default-src 'none'; img-src https://*; child-src 'none';");
            //.expect('X-Powered-By', 'Express');
            //.expect('X-RateLimit-Limit', '100');
            //.expect('X-RateLimit-Remaining', '99');
            //.expect('X-RateLimit-Reset', '1642778639');
            //.expect('X-Response-Time', '2ms');
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
            // console.log(re);

            expect(response.statusCode).toBe(403);
        });
        it('should return list of All tenants', async () => {
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
            await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(tenantData);
            // console.log(re);
            const response = await request(app)
                .post('/tenants/getAll')
                .set('Cookie', `accessToken=${accessToken}`);
            log('===>>>>testtttttttt', response.body);
            log('===>>>>testtttttttt', response.status);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveLength(2);
        });
        it('should return list of All tenants', async () => {
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
            // console.log(re);
            const response = await request(app)
                .post('/tenants/1')
                .set('Cookie', `accessToken=${accessToken}`);
            log('===>>>>testtttttttt', response.body);
            log('===>>>>testtttttttt', response.status);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveLength(2);
        });
    });
});
