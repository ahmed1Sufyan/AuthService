import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import createJWKSMock from 'mock-jwks';
import { User } from '../../src/entity/User';
// import { log } from 'console';

describe('GET /auth/self', () => {
    const userdata = {
        firstName: 'test',
        lastName: 'user',
        email: 'testuser@example.com',
        password: 'testpassword1',
        role: 'customer',
    };
    let Connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    // BEFORE RUN ANY TEST DB SHOULD BE CONNECTED
    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5000');
        Connection = await AppDataSource.initialize();
    });
    // DB SHOULD BE CLEAN BEOFORE EVERY TEST
    beforeEach(async () => {
        // Db truncate
        // await truncateTables(Connection);
        jwks.start();
        await Connection.dropDatabase();
        await Connection.synchronize();
    });
    afterEach(() => jwks.stop());
    // AFTER RUNNING ALL TESTS DB SHOULD BE DISCONNECTED
    afterAll(async () => {
        await Connection.destroy();
    });
    // TEST CASES FOR REGISTERING NEW USERS
    describe('Given all fields', () => {
        it('should return 200 status code', async () => {
            //? sbse pehle hume user ko register krna h phir agar hum browser me hote tw is
            //? api k sth token khud ajata lekin yahan test me hume manually bhjena parega uske
            //? liye server on krna prega test me hume server nhi on krna  h test me agar yeh
            //? production me hota phir aur iski waja se aur public key ko host bhi krna h take token verify kr sake
            //? usse bachne k liye hum mock server on krenge jese JWKS (Json WebKey Set) lib h
            //? isse hum token generate krenge aur manualyy send krenge is api request k sth
            //
            // register new user
            const user = Connection.getRepository(User);
            const UserResponse = await user.save(userdata);
            // generate token
            const accessToken = jwks.token({
                sub: String(UserResponse.id),
                role: UserResponse.role,
            });
            // add token to cookie
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send();
            expect((response.body as Record<string, string>).id).toBe(
                UserResponse.id,
            );
        });
        it('should not return the password in the response', async () => {
            const user = Connection.getRepository(User);
            const savedata = await user.save(userdata);
            const accessToken = jwks.token({
                sub: String(savedata.id),
                role: savedata.role,
            });
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            expect((response.body as Record<string, string>).password).not.toBe(
                userdata.password,
            );
        });
    });
});
