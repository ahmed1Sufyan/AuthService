import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entity/User';
import { TokenService } from '../../src/services/TokenService';
import { RefreshToken } from '../../src/entity/RefreshToken';

describe('GET /auth/self', () => {
    const userdata = {
        firstName: 'test',
        lastName: 'user',
        email: 'testuser@example.com',
        password: 'testpassword1',
        role: 'customer',
    };

    let connection: DataSource;

    // BEFORE RUN ANY TEST DB SHOULD BE CONNECTED
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    // DB SHOULD BE CLEAN BEFORE EVERY TEST
    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    // AFTER RUNNING ALL TESTS DB SHOULD BE DISCONNECTED
    afterAll(async () => {
        await connection.destroy();
    });

    // TEST CASES FOR REGISTERING NEW USERS
    describe('Given all fields', () => {
        it('should return 200 status code', async () => {
            // Register new user
            const userRepo = connection.getRepository(User);
            const userResponse = await userRepo.save(userdata);

            // Generate token
            const refreshTokenRepo = connection.getRepository(RefreshToken);
            const tokenService = new TokenService(refreshTokenRepo);
            const accessToken = tokenService.generateAccessToken({
                sub: String(userResponse.id),
                role: userResponse.role,
            });

            // Send request with token
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', `accessToken=${accessToken}`)
                .send();
            expect((response.body as Record<string, string>).id).toBe(
                userResponse.id,
            );
        });

        it('should not return the password in the response', async () => {
            const userRepo = connection.getRepository(User);
            const savedUser = await userRepo.save(userdata);

            const refreshTokenRepo = connection.getRepository(RefreshToken);
            const tokenService = new TokenService(refreshTokenRepo);
            const accessToken = tokenService.generateAccessToken({
                sub: String(savedUser.id),
                role: savedUser.role,
            });

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(savedUser);
            expect((response.body as Record<string, string>).password).toBe(
                'undefined',
            );
        });
    });
});
