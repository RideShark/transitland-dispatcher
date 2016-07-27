import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render();

    this.render('components/issue-table', {
      into: 'issues.route-geometry.show',
      outlet: 'issue-table'
    });
  },

  model: function(params) {
    var self = this;
    return this.store.find('issue', params['issue_id']).then(function(selectedIssue){
      params['issue_type'] = ['stop_rsp_distance_gap',
                              'distance_calculation_inaccurate',
                              'rsp_line_inaccurate',
                              'stop_position_inaccurate'].join(',');
      params['open'] = true;
      var issues = self.store.query('issue', params);
      let changeset = self.store.createRecord('changeset', {
        notes: 'Issue resolution:'
      });
      changeset.get('change_payloads').createRecord();
      var rsps = [];
      var stops = [];
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
            bounds: null,
            changeset: changeset
          });
        });
      });
    });
  }
});
