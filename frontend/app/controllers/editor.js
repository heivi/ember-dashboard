import Controller from '@ember/controller';

export default Controller.extend({
  empty: function() {
    return this.model.dashboards.length < 1;
  }
});
