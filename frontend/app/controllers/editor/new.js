import Controller from '@ember/controller';

export default Controller.extend({
  name: null,
  actions: {
    saveDashboard() {
      this.get('store').createRecord('Dashboard', {
        name: this.get('name')
      }).save();
      
    }
  }
});
