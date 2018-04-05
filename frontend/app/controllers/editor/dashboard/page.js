import Controller from '@ember/controller';

export default Controller.extend({
  number: 0,
  dash: null,
  name: null,
  timeout: null,
  actions: {
    updatePage() {
      var model = this.get('model');
      console.log("model");
      console.log(model);
      model.set('name', this.get('name'));
      model.set('timeout', this.get('timeout'));
      model.set('number', this.get('number'));
      model.save();
    }
  }
});
