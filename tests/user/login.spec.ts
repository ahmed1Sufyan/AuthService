import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entity/User';
import { user } from '../../src/types';
import { log } from 'console';
import { isJwt } from '..';
import { RefreshToken } from '../../src/entity/RefreshToken';
describe('POST /auth/login', () => {
    const userdata = {
        firstName: 'test',
        lastName: 'user',
        email: 'testuser@example.com',
        password: 'testpassword1',
        role: 'customer',
    };
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
        it('should return 200 status code', async () => {
            await request(app).post('/auth/register').send(userdata);
            const userRepo = await Connection.getRepository(User).find();
            const Response = await request(app)
                .post('/auth/login')
                .send({ email: userdata.email, password: userdata.password });
            expect(userRepo.length).toBe(1);
            expect(Response.statusCode).toBe(200);
        });
        it('should return valid json response', async () => {
            await request(app).post('/auth/register').send(userdata);
            const userRepo = await Connection.getRepository(User).find();
            const Response = await request(app)
                .post('/auth/login')
                .send({ email: userdata.email, password: userdata.password });
            expect(userRepo.length).toBe(1);
            expect(Response.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            );
        });
        it('should return an id of the created user', async () => {
            interface RegisterResponse {
                id: number;
            }
            await request(app).post('/auth/register').send(userdata);
            const userRepo = await Connection.getRepository(User).find();
            const Response = await request(app)
                .post('/auth/login')
                .send({ email: userdata.email, password: userdata.password });
            const responseBody = Response.body as RegisterResponse;
            expect(userRepo.length).toBe(1);
            expect(responseBody).toHaveProperty('id');
            expect(responseBody.id).toBeGreaterThan(0);
        });
        it('should return 400 status code if email is not exists in the database', async () => {
            const userRepo = Connection.getRepository(User);
            await userRepo.save(user);

            const response = await request(app)
                .post('/auth/login')
                .send({ email: 'fake@example.com', password: 'password' });
            const users = await userRepo.find();
            expect(response.statusCode).toBe(400);
            expect(users.length).toBe(1);
        });
        it('should return the access token and refresh token inside the cookie', async () => {
            // await Connection.getRepository(User).save(userdata);
            await request(app).post('/auth/register').send(userdata);
            const response = await request(app)
                .post('/auth/login')
                .send({ email: userdata.email, password: userdata.password });
            // log(response);
            interface Headers {
                ['set-cookie']: string[];
            }
            let accessToken: string = '';
            let refreshToken: string = '';
            const cookies =
                (response.headers as unknown as Headers)['set-cookie'] || [];
            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken')) {
                    accessToken = cookie.split(';')[0].split('=')[1];
                }
                if (cookie.startsWith('refreshToken')) {
                    refreshToken = cookie.split(';')[0].split('=')[1];
                }
            });
            log(accessToken);
            expect(accessToken).toBeTruthy();
            expect(refreshToken).toBeTruthy();
            expect(accessToken).not.toBe(accessToken.trim() == '');
            expect(refreshToken).not.toBe(refreshToken.trim() == '');
            expect(cookies[0]).toEqual(
                expect.stringContaining('HttpOnly') &&
                    expect.stringContaining('SameSite=Strict'),
            );
            expect(cookies[1]).toEqual(
                expect.stringContaining('HttpOnly') &&
                    expect.stringContaining('SameSite=Strict'),
            );

            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });
        it('should store the refresh token in the database', async () => {
            await request(app).post('/auth/register').send(userdata);
            const response = await request(app)
                .post('/auth/login')
                .send({ email: userdata.email, password: userdata.password });
            const refreshtoken_entity = Connection.getRepository(RefreshToken);
            const checkId = await refreshtoken_entity
                .createQueryBuilder('refreshToken')
                .where('refreshToken.userId = :userId', {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany();
            expect(checkId).toHaveLength(2);
        });
    });
    describe('Fields are missing', () => {
        it('should return 400 status code if email is missing', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ email: '', password: userdata.password });
            expect(response.statusCode).toBe(400);
            const userRepo = Connection.getRepository(User);
            const users = await userRepo.find();
            expect(users.length).toBe(0);
            expect(users).toBeInstanceOf(Array);
        });
        it('should return 400 status code if password is missing', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ email: userdata.email, password: '' });
            expect(response.statusCode).toBe(400);
            const userRepo = Connection.getRepository(User);
            const users = await userRepo.find();
            expect(users.length).toBe(0);
        });
        it('should return 400 status code if password is wrong', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ email: '', password: 'fake-password' });
            expect(response.statusCode).toBe(400);
            const userRepo = Connection.getRepository(User);
            const users = await userRepo.find();
            expect(users.length).toBe(0);
        });
    });
    describe('Fields are not in proper format', () => {
        it('should trim the email field', async () => {
            await request(app).post('/auth/register').send(userdata);
            const userRepo = Connection.getRepository(User);
            // await userRepo.save(user);
            await request(app)
                .post('/auth/login')
                .send({
                    email: `${userdata.email}extra`,
                    password: userdata.password,
                });
            // log(res);
            const users = await userRepo.find();
            expect(users[0]).toHaveProperty('email');
            expect(users[0].email).toBe('testuser@example.com');
        });
        // it("should return 400 status code if first name is not a string", async () => {
        //     const response = await request(app)
        //      .post("/auth/register")
        //      .send({...user, firstName: 123, role: Roles.CUSTOMER });
        //      expect(response.statusCode).toBe(400);
        //      const userRepo = Connection.getRepository(User);
        //      const users = await userRepo.find();
        //      expect(users.length).toBe(0);
        // });
    });
});
