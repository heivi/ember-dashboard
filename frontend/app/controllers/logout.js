import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    logout: function() {
      this.get('session').invalidate();
    }
  }
});
