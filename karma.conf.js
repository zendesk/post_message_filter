// Karma configuration
// Generated on Tue Mar 14 2017 17:04:54 GMT+1100 (AEDT)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      'delete_non_clonable.ts',
      'index.ts',
      'spec/*spec.ts'
    ],
    exclude: [
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    reporters: ['dots', 'karma-typescript'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity,

    karmaTypescriptConfig: {
      tsconfig: 'tsconfig.json',
      include: ['spec/*.ts']
    },
    jasmine: {
      random: true
    }
  })
}
