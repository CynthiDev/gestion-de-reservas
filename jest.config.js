
/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  transform: {}, // Para ESM puro, no usamos transformadores
  verbose: true,
  testEnvironment: 'node',
  setupFiles: [], // path to a setup module to configure the testing environment before each test
};


  export default config;