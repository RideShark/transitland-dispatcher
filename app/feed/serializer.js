import ApplicationSerializer from '../application/serializer';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  primaryKey: 'onestop_id',
  attrs: {
    changesets_imported_from_this_feed: {
      key: 'changesets_imported_from_this_feed',
      deserialize: 'ids'
    },
    issues: {
      embedded: 'always'
    }
  }
});
