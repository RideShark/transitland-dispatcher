import Ember from 'ember';

export default Ember.Component.extend({
  color: Ember.computed(function(){
    return '#000';
  }),
  onestop_id: '',
  actions: {
    rspAdded: function(addEvent) {
      this.sendAction('rspAdded', addEvent.target._leaflet_id, this.get('onestop_id'));
    },
    popupOpen: function(e) {
      let content = "<p>" + this.get('onestop_id') + "</p>"
      e.popup.setContent(content);
    }
  }
});
