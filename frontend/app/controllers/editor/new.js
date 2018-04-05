import Controller from '@ember/controller';

export default Controller.extend({
  name: null,
  actions: {
    saveDashboard() {
      this.get('store').createRecord('Dashboard', {
        name: this.get('name')
      }).save().then((dash) => {
        this.transitionToRoute('editor.dashboard', dash.get('id'));
      });
      
    }
  }
});
