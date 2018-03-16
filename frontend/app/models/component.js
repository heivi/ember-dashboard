import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('date'),
  minWidth: DS.attr('number'),
  minHeight: DS.attr('number'),
  width: DS.attr('number'),
  height: DS.attr('number'),
  type: DS.attr('string'),
  componentData: DS.attr(),
  name: DS.attr('string'),
  public: DS.attr('boolean'),
  triggers: DS.attr(),
  page: DS.belongsTo('page')
});
