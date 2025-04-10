module.exports = {
    // Set the root folder for Jest
    rootDir: '.',

    // Set the test environment to use
    testEnvironment: 'node',

    // Set the regex pattern to match test files
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',

    // Set the folders to ignore for tests
    testPathIgnorePatterns: ['/node_modules/', '/lib/'],

    transform: {
        '^.+\\.(t|j)sx?$': 'ts-jest',
    },

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

    setupFilesAfterEnv: ['./jest.setup.js'],
};
