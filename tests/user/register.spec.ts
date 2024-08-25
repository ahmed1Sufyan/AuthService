import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entity/User';
import { user } from '../../src/types';
import { Roles } from '../../src/constants';
import { isJwt } from '..';
import { RefreshToken } from '../../src/entity/RefreshToken';
describe('POST /auth/register', () => {
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
            const Response = await request(app)
                .post('/auth/register')
                .send(user);
            expect(Response.statusCode).toBe(201);
        });
        it('should return valid json response', async () => {
            const Response = await request(app)
                .post('/auth/register')
                .send(user);
            expect(Response.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            );
        });
        it('should persist the user in the database', async () => {
            await request(app).post('/auth/register').send(user);

            const userRepo = Connection.getRepository(User);
            const users = await userRepo.find();
            // expect(users.length).toBe(1);
            expect(users[0].firstName).toBe(user.firstName);
            expect(users[0].lastName).toBe(user.lastName);
            expect(users[0].email).toBe(user.email);
        });
        it('should return an id of the created user', async () => {
            interface RegisterResponse {
                id: number;
            }
            const response = await request(app)
                .post('/auth/register')
                .send(user)
                .expect(201);
            const responseBody = response.body as RegisterResponse;
            expect(responseBody).toHaveProperty('id');
            expect(responseBody.id).toBeGreaterThan(0);
        });
        it('should assign a customer role', async () => {
            await request(app).post('/auth/register').send(user).expect(201);
            const userRepo = AppDataSource.getRepository(User);
            const users = await userRepo.find();
            expect(users[0]).toHaveProperty('role');
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });
        it('should store the hashed password in the database', async () => {
            await request(app).post('/auth/register').send(user).expect(201);
            const userRepo = AppDataSource.getRepository(User);
            const users = await userRepo.find();
            expect(users[0].password).not.toBe(user.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });
        it('should return 400 status code if email is already exists', async () => {
            const userRepo = Connection.getRepository(User);
            await userRepo.save(user);

            const response = await request(app)
                .post('/auth/register')
                .send(user);
            const users = await userRepo.find();
            expect(response.statusCode).toBe(400);
            expect(users.length).toBe(1);
        });
        it('should return the access token and refresh token inside the cookie', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send(user);
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
            // log(cookies);
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
            const response = await request(app)
                .post('/auth/register')
                .send(user);
            const refreshtoken_entity = Connection.getRepository(RefreshToken);
            const checkId = await refreshtoken_entity
                .createQueryBuilder('refreshToken')
                .where('refreshToken.userId = :userId', {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany();
            expect(checkId).toHaveLength(1);
        });
    });
    describe('Fields are missing', () => {
        it('should return 400 status code if email is missing', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ ...user, email: '', role: Roles.CUSTOMER });

            expect(response.statusCode).toBe(400);

            const userRepo = Connection.getRepository(User);
            const users = await userRepo.find();
            expect(users.length).toBe(0);
            expect(users).toBeInstanceOf(Array);
        });
        it('should return 400 status code if firstName is missing', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ ...user, firstName: '', role: Roles.CUSTOMER });

            expect(response.statusCode).toBe(400);
            const userRepo = Connection.getRepository(User);
            const users = await userRepo.find();
            expect(users.length).toBe(0);
        });
        it('should return 400 status code if lastName is missing', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ ...user, lastName: '', role: Roles.CUSTOMER });

            expect(response.statusCode).toBe(400);

            const userRepo = Connection.getRepository(User);
            const users = await userRepo.find();
            expect(users.length).toBe(0);
        });
        it('should return 400 status code if password is missing', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ ...user, password: '', role: Roles.CUSTOMER });

            const userRepo = Connection.getRepository(User);
            const users = await userRepo.find();
            expect(users.length).toBe(0);
            // expect(users[0].password.length).toBeGreaterThanOrEqual(8);
            // expect(users[0].password.length).toBeLessThanOrEqual(20);
            expect(response.statusCode).toBe(400);
        });
    });
    describe('Fields are not in proper format', () => {
        it('should trim the email field', async () => {
            const userRepo = Connection.getRepository(User);
            const user = {
                firstName: 'test',
                lastName: 'user',
                email: 'testuser@example.com  ',
                password: 'testpassword1',
                role: Roles.CUSTOMER,
            };
            // await userRepo.save(user);
            await request(app).post('/auth/register').send(user);
            // log(res);
            const users = await userRepo.find();

            expect(users[0]).toHaveProperty('email');
            expect(users[0].email).toBe('testuser@example.com');
        });
        it('should return 400 status code if password is lessthan 8 chars', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ ...user, password: 'sufyan', role: Roles.CUSTOMER });

            const userRepo = Connection.getRepository(User);
            const users = await userRepo.find();
            expect(response.statusCode).toBe(400);
            expect(users.length).toBe(0);
        });
        it('should return 400 status code if email is not valid', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ ...user, email: 'sufyan.com', role: Roles.CUSTOMER });

            const userRepo = Connection.getRepository(User);
            const users = await userRepo.find();
            expect(response.statusCode).toBe(400);
            expect(users.length).toBe(0);
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