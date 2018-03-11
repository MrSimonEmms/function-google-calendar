/**
 * calendar
 */

/* Node modules */
const qs = require('querystring');

/* Third-party modules */
const request = require('request-promise-native');

/* Files */

module.exports = class GCal {
  constructor (clientId, clientSecret, refreshToken) {
    this.config = {
      clientId,
      clientSecret,
      refreshToken
    };
  }

  exchangeRefreshToken () {
    const opts = {
      url: 'https://www.googleapis.com/oauth2/v4/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      json: true,
      form: {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: this.config.refreshToken,
        grant_type: 'refresh_token'
      }
    };

    return request(opts)
      .then(result => result.access_token);
  }

  getCalendarEvents (calendarId, timeMin = null, timeMax = null) {
    return this.exchangeRefreshToken()
      .then(token => {
        const params = {
          alwaysIncludeEmail: false,
          orderBy: 'startTime',
          singleEvents: true
        };

        if (timeMin && timeMax) {
          params.timeMin = timeMin;
          params.timeMax = timeMax;
        }

        const qsParams = qs.stringify(params);

        const opts = {
          url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${qsParams}`,
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`
          },
          json: true
        };

        return request(opts)
          .then(({ items = [] }) => items);
      });
  }
};
