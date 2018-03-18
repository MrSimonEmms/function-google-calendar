/**
 * handler
 */

/* Node modules */
const fs = require('fs');

/* Third-party modules */
const yml = require('js-yaml');

/* Files */
const GCal = require('./calendar');

function secretOrEnvvar (secretFile, envvar) {
  let value;
  try {
    value = fs.readFileSync(secretFile, 'utf8');
  } catch (err) {
    value = process.env[envvar];
  }

  return value;
}

const config = {
  clientId: secretOrEnvvar('/run/secrets/google_calendar_client_id', 'CLIENT_ID'),
  clientSecret: secretOrEnvvar('/run/secrets/google_calendar_client_secret', 'CLIENT_SECRET'),
};

module.exports = input => Promise
  .resolve()
  .then(() => {
    /* JSON is valid YAML */
    const inputArgs = yml.safeLoad(input);

    const { args = '', method, refreshToken } = inputArgs;

    const cal = new GCal(config.clientId, config.clientSecret, refreshToken);

    return cal[method](args);
  });
