import Ember from 'ember';
import DS from 'ember-data';

import EntityWithActivityModel from 'dispatcher/entity-with-activity/model';

export default EntityWithActivityModel.extend({
	created_or_updated_in_changeset: DS.belongsTo('changeset', { async: true }),
	onestop_id: Ember.computed.alias('id'),
	name: DS.attr('string'),
	created_at: DS.attr('date'),
	updated_at: DS.attr('date'),
	geometry: DS.attr(),
	geometry_reversegeo: DS.attr(),
  centroid: DS.attr(),
	tags: DS.attr(),
	issues: DS.hasMany('issue'),
  timezone: DS.attr('string'),
  coordinates: Ember.computed('centroid', function () {
    return this.get('centroid').coordinates.slice().reverse();
  }),
  setCoordinates: function(value) {
    this.set('geometry', {type: 'Point', coordinates: value.map(function(c) { return parseFloat(c.toFixed(5)); } ) });
  },
  entityType: function() {
    return 'stop';
  },
  toChange: function() {
    return {
      onestopId: this.id,
      name: this.get('name'),
      timezone: this.get('timezone'),
      geometry: {
        type: "Point",
        coordinates: this.get('geometry').coordinates
      }
    };
  }
});
