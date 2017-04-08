import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  currentUser: Ember.inject.service(),
  model: function() {
    let changeset = this.store.createRecord('changeset', {
      user: this.get('currentUser.user'),
      notes: ''
    });
    changeset.get('change_payloads').createRecord();
    let users = this.store.query('user', { per_page: false });
    return Ember.RSVP.hash({
      changeset: changeset,
      users: users
    });
  },
  actions: {
    create: function() {
      let self = this;
      let changeset = self.currentModel.changeset;
      const flashMessages = Ember.get(this, 'flashMessages');
      changeset.save().then(function() {
        self.transitionTo('changesets.show', changeset);
      }).catch(function(error) {
        flashMessages.add({
          message: `Error(s) creating changeset: ${error.message}`,
          type: 'danger',
          sticky: true
        });
      });

    }
  }
});
