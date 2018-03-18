/**
 * calendar
 */

/* Node modules */
const qs = require('querystring');

/* Third-party modules */
const { _ } = require('lodash');
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

  deleteCalendarEvent (opts) {
    return this.exchangeRefreshToken()
      .then(token => {
        const calendarId = opts.calendarId;
        const eventId = opts.eventId;

        if (!calendarId) {
          throw new Error('calendarId is a required option');
        }

        if (!eventId) {
          throw new Error('eventId is a required option');
        }

        const config = {
          url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${token}`
          },
          json: true
        };

        return request(config)
          .then(() => ({
            eventId
          }));
      });
  }

  getCalendarEvents (opts) {
    return this.exchangeRefreshToken()
      .then(token => {
        const calendarId = opts.calendarId;

        if (!calendarId) {
          throw new Error('calendarId is a required option');
        }

        delete opts.calendarId;

        const params = _.defaults(opts, {
          alwaysIncludeEmail: false,
          orderBy: 'startTime',
          showDeleted: false,
          singleEvents: true
        });

        const dates = [
          'timeMin',
          'timeMax'
        ];

        dates.forEach(item => {
          try {
            params[item] = params[item].toISOString();
          } catch (err) {
            delete params[item];
          }
        });

        const qsParams = qs.stringify(params);

        const config = {
          url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${qsParams}`,
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`
          },
          json: true
        };

        return request(config);
      })
      .then(({ items = [] }) => items);
  }
};
