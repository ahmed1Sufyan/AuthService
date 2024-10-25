"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const data_source_1 = require("../../src/config/data-source");
const User_1 = require("../../src/entity/User");
const types_1 = require("../../src/types");
const __1 = require("..");
const RefreshToken_1 = require("../../src/entity/RefreshToken");
describe('POST /auth/login', () => {
    const userdata = {
        firstName: 'test',
        lastName: 'user',
        email: 'testuser@example.com',
        password: 'testpassword1',
        role: 'customer',
    };
    let Connection;
    // BEFORE RUN ANY TEST DB SHOULD BE CONNECTED
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        Connection = yield data_source_1.AppDataSource.initialize();
    }));
    // DB SHOULD BE CLEAN BEOFORE EVERY TEST
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Db truncate
        // await truncateTables(Connection);
        yield Connection.dropDatabase();
        yield Connection.synchronize();
    }));
    // AFTER RUNNING ALL TESTS DB SHOULD BE DISCONNECTED
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Connection.destroy();
    }));
    // TEST CASES FOR REGISTERING NEW USERS
    describe('Given all fields', () => {
        it('should return 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(userdata);
            const userRepo = yield Connection.getRepository(User_1.User).find();
            const Response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({ email: userdata.email, password: userdata.password });
            expect(userRepo.length).toBe(1);
            expect(Response.statusCode).toBe(200);
        }));
        it('should return valid json response', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(userdata);
            const userRepo = yield Connection.getRepository(User_1.User).find();
            const Response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({ email: userdata.email, password: userdata.password });
            expect(userRepo.length).toBe(1);
            expect(Response.headers['content-type']).toEqual(expect.stringContaining('json'));
        }));
        it('should return an id of the created user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(userdata);
            const userRepo = yield Connection.getRepository(User_1.User).find();
            const Response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({ email: userdata.email, password: userdata.password });
            const responseBody = Response.body;
            expect(userRepo.length).toBe(1);
            expect(responseBody).toHaveProperty('id');
            expect(responseBody.id).toBeGreaterThan(0);
        }));
        it('should return 400 status code if email is not exists in the database', () => __awaiter(void 0, void 0, void 0, function* () {
            const userRepo = Connection.getRepository(User_1.User);
            yield userRepo.save(types_1.user);
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({ email: 'fake@example.com', password: 'password' });
            const users = yield userRepo.find();
            expect(response.statusCode).toBe(400);
            expect(users.length).toBe(1);
        }));
        it('should return the access token and refresh token inside the cookie', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(userdata);
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({ email: userdata.email, password: userdata.password });
            let accessToken = '';
            let refreshToken = '';
            const cookies = response.headers['set-cookie'] || [];
            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken')) {
                    accessToken = cookie.split(';')[0].split('=')[1];
                }
                if (cookie.startsWith('refreshToken')) {
                    refreshToken = cookie.split(';')[0].split('=')[1];
                }
            });
            expect(accessToken).toBeTruthy();
            expect(refreshToken).toBeTruthy();
            expect(accessToken).not.toBe(accessToken.trim() == '');
            expect(refreshToken).not.toBe(refreshToken.trim() == '');
            expect(cookies[0]).toEqual(expect.stringContaining('HttpOnly') &&
                expect.stringContaining('SameSite=Strict'));
            expect(cookies[1]).toEqual(expect.stringContaining('HttpOnly') &&
                expect.stringContaining('SameSite=Strict'));
            expect((0, __1.isJwt)(accessToken)).toBeTruthy();
            expect((0, __1.isJwt)(refreshToken)).toBeTruthy();
        }));
        it('should store the refresh token in the database', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(userdata);
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({ email: userdata.email, password: userdata.password });
            const refreshtoken_entity = Connection.getRepository(RefreshToken_1.RefreshToken);
            const checkId = yield refreshtoken_entity
                .createQueryBuilder('refreshToken')
                .where('refreshToken.userId = :userId', {
                userId: response.body.id,
            })
                .getMany();
            expect(checkId).toHaveLength(2);
        }));
    });
    describe('Fields are missing', () => {
        it('should return 400 status code if email is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({ email: '', password: userdata.password });
            expect(response.statusCode).toBe(400);
            const userRepo = Connection.getRepository(User_1.User);
            const users = yield userRepo.find();
            expect(users.length).toBe(0);
            expect(users).toBeInstanceOf(Array);
        }));
        it('should return 400 status code if password is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({ email: userdata.email, password: '' });
            expect(response.statusCode).toBe(400);
            const userRepo = Connection.getRepository(User_1.User);
            const users = yield userRepo.find();
            expect(users.length).toBe(0);
        }));
        it('should return 400 status code if password is wrong', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({ email: '', password: 'fake-password' });
            expect(response.statusCode).toBe(400);
            const userRepo = Connection.getRepository(User_1.User);
            const users = yield userRepo.find();
            expect(users.length).toBe(0);
        }));
    });
    describe('Fields are not in proper format', () => {
        it('should trim the email field', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(userdata);
            const userRepo = Connection.getRepository(User_1.User);
            yield (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({
                email: `${userdata.email}extra`,
                password: userdata.password,
            });
            const users = yield userRepo.find();
            expect(users[0]).toHaveProperty('email');
            expect(users[0].email).toBe('testuser@example.com');
        }));
    });
});
