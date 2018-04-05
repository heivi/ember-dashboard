import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('date'),
  minWidth: DS.attr('string'),
  minHeight: DS.attr('string'),
  width: DS.attr('string'),
  height: DS.attr('string'),
  type: DS.attr('string'),
  componentData: DS.attr('string'),
  name: DS.attr('string'),
  public: DS.attr('boolean'),
  triggers: DS.attr('string'),
  page: DS.belongsTo('page'),
  classes: DS.attr('string')
});
