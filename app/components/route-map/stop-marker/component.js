import Ember from 'ember';
import config from '../../../config/environment';

export default Ember.Component.extend({
  onestop_id: '',
  markerStopIcon: L.icon({
    iconUrl: config.rootURL + 'assets/images/station.png',
    iconSize: [36, 54],
    iconAnchor: [18, 54],
    popupAnchor: [0, -54]
  }),
  actions: {
    stopAdded: function(addEvent) {
      this.sendAction('stopAdded', addEvent.target._leaflet_id, this.get('onestop_id'));
    }
  }
});
