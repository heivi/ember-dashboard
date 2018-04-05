import Controller from '@ember/controller';

export default Controller.extend({
  name: null,
  actions: {
    updateDash() {
      var model = this.get('model');
      console.log("model");
      console.log(model);
      model.set('name', this.get('name'));
      model.save();
    },
    deleteDash() {
      var model = this.get('model');
      model.deleteRecord();
      model.save().then(() => {
        this.transitionToRoute('editor');
      });
    }
  }
});