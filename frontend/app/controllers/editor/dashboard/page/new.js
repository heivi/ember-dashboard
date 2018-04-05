import Controller from '@ember/controller';

export default Controller.extend({
  number: 0,
  dash: null,
  name: null,
  actions: {
    savePage() {
      //console.log(this.get(dashid));
      this.get('store').createRecord('Page', {
        number: this.get('number'),
        dashboard: this.get('dash'),
        name: this.get('name')
      }).save();
    }
  }
});
