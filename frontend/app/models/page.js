import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('date'),
  components: DS.hasMany('component'),
  dashboard: DS.belongsTo('dashboard')
});
