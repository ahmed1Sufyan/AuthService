/** @type {import('ts-jest').JestConfigWithTsJest} **/
// eslint-disable-next-line no-undef
module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+.tsx?$': ['ts-jest', {}],
    },
    verbose: true,
    testTimeout: 30000,
    collectCoverage: true,
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.ts', '!test/**', '!**/node_modules/**'],
    testPathIgnorePatterns: ['/node_modules/', 'AUTHSERVICE/dist/'],
};
