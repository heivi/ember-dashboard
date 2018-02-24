import DS from 'ember-data';

export default DS.Model.extend({
  userId: DS.attr('string'),
  created: DS.attr('date'),
  pages: DS.hasMany('page'),
  name: DS.attr('string')
});
