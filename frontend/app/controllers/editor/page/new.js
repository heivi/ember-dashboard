import Controller from '@ember/controller';

export default Controller.extend({
  number: null,
  actions: {
    savePage() {
      this.get('store').createRecord('Page', {
        number: this.get('number')
      }).save();
    }
  }
});
