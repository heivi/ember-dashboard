import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('date'),
  components: DS.hasMany('component'),
  number: DS.attr('number'),
  dashboard: DS.belongsTo('dashboard'),
  name: DS.attr('string')
});
