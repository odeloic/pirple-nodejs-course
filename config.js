/*
 * Create and export configuration vars
 *
 */

 // Container for all the environments
 var environments = {}

 // staging (default) environment

 environments.staging = {
  'port': 3000,
  'envName' : 'staging'
 };

 // Production environment
 environments.production = {
  'port' : 5000,
  'envName' : 'production'
 };

 // Determine which environment was passed as a command-line arg
 var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

 // Check that the current environemt is one of the environments above, if not, default to staging
 var enviromentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging

 // Export the module

 module.exports = enviromentToExport