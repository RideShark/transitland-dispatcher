import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  change_payloads: DS.hasMany('change-payload', { async: true }),
  notes: DS.attr('string'),
  applied: DS.attr('boolean'),
  applied_at: DS.attr('date'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
  apply: function() {
    var applicationAdapter = this.store.adapterFor(this.constructor.typeKey);
    var modelUrl = applicationAdapter.buildURL('changeset', this.id);
    var applyUrl = modelUrl + '/apply';
    return applicationAdapter.ajax(applyUrl, 'post');
  }
});
