import Ember from 'ember';
import DS from 'ember-data';
import ENV from 'dispatcher/config/environment';

export default DS.RESTAdapter.extend({
  session: Ember.inject.service(),
  host: ENV.datastoreHost,
  namespace: 'api/v1',
  headers: Ember.computed('session.authToken', function() {
    // Sometimes this is loaded before the session is available.
    // For example, when the users index route goes out to GET users.
    var authToken = this.get("session.authToken") || localStorage.getItem(ENV.AUTH_TOKEN_LOCALSTORAGE_KEY);
    return {
      'Authorization': `Token token=${authToken}`
    };
  }),
  ajaxOptions: function(url, type, options) {
    var hash = this._super(url, type, options);
    // only need to include api_key when making GET requests
    // because those are the most frequent type of request.
    // if we include api_key in POSTs or PUTs, Datastore will barf
    if (typeof(ENV.apiProxyKey) !== "undefined" && type === 'GET') {
      let data = {};
      if (typeof(hash.data) === 'string') {
        data = JSON.parse(hash.data);
      }
      data["api_key"] = ENV.apiProxyKey;
      hash.data = data;
    }
    return hash;
  }
});
