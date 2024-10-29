/** @type {import('ts-jest').JestConfigWithTsJest} **/
// eslint-disable-next-line no-undef
module.exports = {
    testEnvironment: 'node',
    // transform: {
    //     '^.+.tsx?$': ['ts-jest', {}],
    // },
    preset : "ts-jest",
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    verbose: true,
    collectCoverage: true,
    coverageProvider: 'v8',
    collectCoverageFrom: ["src/**/*.ts", "!tests/**", "!**/node_modules/**"],
    // testPathIgnorePatterns: ['/node_modules/', 'AUTHSERVICE/dist/'],
};
