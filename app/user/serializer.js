import DS from 'ember-data';
import ApplicationSerializer from '../application/serializer';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    // id: { serialize: false }
  }
});
