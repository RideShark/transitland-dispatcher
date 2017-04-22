import Ember from 'ember';

export default Ember.Route.extend({
  currentUser: Ember.inject.service(),
  queryParams: {
    zoom: {
      replace: true
    },
    lat: {
      replace: true,
    },
    lng: {
      replace: true,
    },
    bbox: {
      replace: true,
      refreshModel: true
    }
  },
  model: function(params) {
    var bbox = params.bbox;
    // Changeset
    let changeset = this.store.createRecord('changeset', {
      user: this.get('currentUser.user'),
      notes: 'Station editor:'
    });
    changeset.get('change_payloads').createRecord();
    // Users
    let users = this.store.query('user', { per_page: false });
    // Stops
    let stops = this.store.query('stop-station', {embed_issues: true, bbox: bbox, per_page: 100, total: false});
    return Ember.RSVP.hash({
      changeset: changeset,
      users: users,
      stops: stops
    });
  }
});
