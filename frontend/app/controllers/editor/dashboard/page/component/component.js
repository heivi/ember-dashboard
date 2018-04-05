import Controller from '@ember/controller';

export default Controller.extend({
  page: null,
  name: null,
  minWidth: null,
  minHeight: null,
  height: null,
  width: null,
  type: null,
  public: false,
  componentData: null,
  trigger: null,
  classes: null,
  actions: {
    updateComponent() {
      //console.log(this.get(dashid));
      var model = this.get('model');
      console.log("model");
      console.log(model);
      model.set('name', this.get('name'));
      model.set('minWidth', this.get('minWidth'));
      model.set('minHeight', this.get('minHeight'));
      model.set('height', this.get('height'));
      model.set('width', this.get('width'));
      model.set('type', this.get('type'));
      model.set('public', this.get('public'));
      model.set('componentData', this.get('componentData'));
      model.set('triggers', this.get('triggers'));
      model.set('classes', this.get('classes'));
      model.save();
    }
  }
});
