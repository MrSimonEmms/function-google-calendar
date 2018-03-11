/**
 * handler
 */

/* Node modules */

/* Third-party modules */
const yml = require('js-yaml');

/* Files */
const GCal = require('./calendar');

const config = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
};

module.exports = input => Promise
  .resolve()
  .then(() => {
    /* JSON is valid YAML */
    const inputArgs = yml.safeLoad(input);

    const { args = '', method, refreshToken } = inputArgs;

    const cal = new GCal(config.clientId, config.clientSecret, refreshToken);

    const methodArgs = args
      .split(',')
      .filter(value => !!value);

    return cal[method](...methodArgs);
  });
