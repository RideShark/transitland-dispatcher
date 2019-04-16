import Ember from 'ember';

export default Ember.Component.extend({
  enumOptions: {
    license_use_without_attribution: [
      'yes', 'no', 'unknown'
    ],
    license_create_derived_product: [
      'yes', 'no', 'unknown'
    ],
    license_redistribute: [
      'yes', 'no', 'unknown'
    ]
  }
});
