module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/__tests__/*.test.js(x)?'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js', '<rootDir>/tests/helpers.js'],
  coverageDirectory: '<rootDir>/tests/coverage',
};