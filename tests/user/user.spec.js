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
const TokenService_1 = require("../../src/services/TokenService");
const RefreshToken_1 = require("../../src/entity/RefreshToken");
describe('GET /auth/self', () => {
    const userdata = {
        firstName: 'test',
        lastName: 'user',
        email: 'testuser@example.com',
        password: 'testpassword1',
        role: 'customer',
    };
    let connection;
    // BEFORE RUN ANY TEST DB SHOULD BE CONNECTED
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        connection = yield data_source_1.AppDataSource.initialize();
    }));
    // DB SHOULD BE CLEAN BEFORE EVERY TEST
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.dropDatabase();
        yield connection.synchronize();
    }));
    // AFTER RUNNING ALL TESTS DB SHOULD BE DISCONNECTED
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.destroy();
    }));
    // TEST CASES FOR REGISTERING NEW USERS
    describe('Given all fields', () => {
        it('should return 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            // Register new user
            const userRepo = connection.getRepository(User_1.User);
            const userResponse = yield userRepo.save(userdata);
            // Generate token
            const refreshTokenRepo = connection.getRepository(RefreshToken_1.RefreshToken);
            const tokenService = new TokenService_1.TokenService(refreshTokenRepo);
            const accessToken = tokenService.generateAccessToken({
                sub: String(userResponse.id),
                role: userResponse.role,
            });
            // Send request with token
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/auth/self')
                .set('Cookie', `accessToken=${accessToken}`)
                .send();
            expect(response.body.id).toBe(userResponse.id);
        }));
        it('should not return the password in the response', () => __awaiter(void 0, void 0, void 0, function* () {
            const userRepo = connection.getRepository(User_1.User);
            const savedUser = yield userRepo.save(userdata);
            const refreshTokenRepo = connection.getRepository(RefreshToken_1.RefreshToken);
            const tokenService = new TokenService_1.TokenService(refreshTokenRepo);
            const accessToken = tokenService.generateAccessToken({
                sub: String(savedUser.id),
                role: savedUser.role,
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/auth/self')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(savedUser);
            expect(response.body.password).toBe('undefined');
        }));
    });
});
