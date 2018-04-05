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
    }
  }
});