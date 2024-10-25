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
const Tenant_1 = require("../../src/entity/Tenant");
const TokenService_1 = require("../../src/services/TokenService");
const RefreshToken_1 = require("../../src/entity/RefreshToken");
const constants_1 = require("../../src/constants");
describe('POST /tenants', () => {
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
        it('should return 201 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const RefreshtokenRepo = data_source_1.AppDataSource.getRepository(RefreshToken_1.RefreshToken);
            const tokenService = new TokenService_1.TokenService(RefreshtokenRepo);
            const accessToken = tokenService.generateAccessToken({
                sub: '1',
                role: constants_1.Roles.ADMIN,
            });
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/tenants')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(tenantData);
            expect(response.statusCode).toBe(201);
        }));
        it('should create a new tenant in the database', () => __awaiter(void 0, void 0, void 0, function* () {
            const RefreshtokenRepo = data_source_1.AppDataSource.getRepository(RefreshToken_1.RefreshToken);
            const tokenService = new TokenService_1.TokenService(RefreshtokenRepo);
            const accessToken = tokenService.generateAccessToken({
                sub: '1',
                role: constants_1.Roles.ADMIN,
            });
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            };
            // add token to cookie
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/tenants')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(tenantData);
            const tenant = yield Connection.getRepository(Tenant_1.Tenant).find();
            expect(tenant).toBeTruthy();
            expect(response.statusCode).toBe(201);
        }));
        it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/tenants')
                .send(tenantData);
            expect(response.statusCode).toBe(401);
        }));
        it('should return 403 when the user is not admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const RefreshtokenRepo = data_source_1.AppDataSource.getRepository(RefreshToken_1.RefreshToken);
            const tokenService = new TokenService_1.TokenService(RefreshtokenRepo);
            const accessToken = tokenService.generateAccessToken({
                sub: '1',
                role: constants_1.Roles.MANAGER,
            });
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/tenants')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(tenantData);
            expect(response.statusCode).toBe(403);
        }));
        it('should return list of All tenants', () => __awaiter(void 0, void 0, void 0, function* () {
            const RefreshtokenRepo = data_source_1.AppDataSource.getRepository(RefreshToken_1.RefreshToken);
            const tokenService = new TokenService_1.TokenService(RefreshtokenRepo);
            const accessToken = tokenService.generateAccessToken({
                sub: '1',
                role: constants_1.Roles.ADMIN,
            });
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            };
            yield (0, supertest_1.default)(app_1.default)
                .post('/tenants')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(tenantData);
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/tenants/getAll')
                .set('Cookie', `accessToken=${accessToken}`);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveLength(1);
        }));
        it('should return list of All tenants', () => __awaiter(void 0, void 0, void 0, function* () {
            const RefreshtokenRepo = data_source_1.AppDataSource.getRepository(RefreshToken_1.RefreshToken);
            const tokenService = new TokenService_1.TokenService(RefreshtokenRepo);
            const accessToken = tokenService.generateAccessToken({
                sub: '1',
                role: constants_1.Roles.ADMIN,
            });
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            };
            yield (0, supertest_1.default)(app_1.default)
                .post('/tenants')
                .set('Cookie', `accessToken=${accessToken}`)
                .send(tenantData);
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/tenants/1')
                .set('Cookie', `accessToken=${accessToken}`);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveLength(2);
        }));
    });
});
