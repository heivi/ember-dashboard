import Controller from '@ember/controller';

export default Controller.extend({
  page: null,
  name: null,
  actions: {
    saveComponent() {
      //console.log(this.get(dashid));
      this.get('store').createRecord('Component', {
        page: this.get('page'),
        name: this.get('name')
      }).save().then((compo) => {
        this.transitionToRoute('editor.dashboard.page.component', compo.get('id'));
      });
    }
  }
});
