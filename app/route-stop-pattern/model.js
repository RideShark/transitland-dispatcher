import Ember from 'ember';
import DS from 'ember-data';
import EntityWithActivityModel from 'dispatcher/entity-with-activity/model';

export default EntityWithActivityModel.extend({
	created_or_updated_in_changeset: DS.belongsTo('changeset', { async: true }),
	identifiers: DS.attr(),
  trips: DS.attr(),
  stop_distances: DS.attr(),
  stop_pattern: DS.attr(),
  color: DS.attr('string'),
  route_onestop_id: DS.attr('string', {readOnly: true}),
	onestop_id: Ember.computed.alias('id'),
	created_at: DS.attr('date'),
	updated_at: DS.attr('date'),
	geometry: DS.attr(),
	tags: DS.attr(),
	issues: DS.hasMany('issue'),
	patterns: [
		{offset: 0, repeat: 20, symbol: L.Symbol.arrowHead({pixelSize: 12, pathOptions: {fillOpacity: 1, weight: 0}})}
	],
	stopsWithDistances: Ember.computed('stop_pattern', function(){
		var self = this;
		var args = {};
		var stops = this.store.query('stop', { onestop_id: self.get('stop_pattern').join(',') });
		args.promise = stops.then(function(stops) {
			return stops.map(function(stop, index) {
				return { stop: stop, distance: self.get('stop_distances')[index] }
			});
		});
		return Ember.ArrayProxy.extend(Ember.PromiseProxyMixin).create(args);
	}),
	coordinates: Ember.computed(function(){
		return this.get('geometry').coordinates.map(function(coord){
			return coord.slice().reverse();
		});
	}),
	setCoordinates: function(coords) {
		this.set('geometry', {type: 'LineString',
													coordinates: coords.map(function(c) { return c.map(function(n) { return parseFloat(n.toFixed(5));  } ) })
		});
	},
	entityType: function() {
    return 'routeStopPattern';
  },
  toChange: function() {
    return {
      onestopId: this.get('onestop_id'),
      stopPattern: this.get('stop_pattern'),
      geometry: {
        type: "LineString",
        coordinates: this.get('geometry').coordinates
      }
    };
  }
});
