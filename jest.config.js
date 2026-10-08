const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
    ...jestConfig,
    moduleNameMapper: {
        ...jestConfig.moduleNameMapper,
        '^lightning/flowSupport$': '<rootDir>/force-app/test/jest-mocks/lightning/flowSupport'
    }
};
