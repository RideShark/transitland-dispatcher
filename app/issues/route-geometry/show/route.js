import Ember from 'ember';

export default Ember.Route.extend({

  // this is temporary
  beforeModel: function(transition){
    this.set('feed_onestop_id', transition.params['issues.route-geometry'].feed_id);
  },

  model: function(params) {
    var self = this;
    return this.store.find('issue', params['issue_id']).then(function(selectedIssue){
      params['issue_type'] = ['stop_rsp_distance_gap',
                              'distance_calculation_inaccurate',
                              'rsp_line_inaccurate',
                              'stop_position_inaccurate'].join(',');
      params['open'] = true;
      params['feed_onestop_id'] = self.get('feed_onestop_id');
      var issues = self.store.query('issue', params);
      let changeset = self.store.createRecord('changeset', {
        notes: 'Issue resolution:'
      });
      changeset.get('change_payloads').createRecord();
      var rsps = [];
      var stops = [];
      // do on issue model itself
      // check operator serializer, polymorphic relationship, async
      selectedIssue.get('entities_with_issues').forEach(function(entity){
        if (entity.onestop_id.split('-')[0] === 'r') {
          rsps.push(entity.onestop_id);
        }
        else if (entity.onestop_id.split('-')[0] === 's') {
          stops.push(entity.onestop_id);
        }
      });
      return self.store.query('stop', {onestop_id: stops.join(',')}).then(function(stops){
        var bounds = new L.latLngBounds(stops.map(function(stop) {
          return new L.latLng(stop.get('coordinates'));
        }));
        return self.store.query('route-stop-pattern', {onestop_id: rsps.join(',')}).then(function(rsps){

          rsps.forEach(function(rsp){
            rsp.get('coordinates').forEach(function(coord){
              bounds.extend(new L.latLng(coord));
            });
          });

          return Ember.RSVP.hash({
            issues: issues,
            selectedIssue: selectedIssue,
            issueRouteStopPatterns: rsps,
            issueStops: stops,
            bounds: bounds,
            changeset: changeset
          });
        });
      });
    });
  }
});
