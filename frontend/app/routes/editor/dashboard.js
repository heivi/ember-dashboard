import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    return this.get('store').findRecord('dashboard',params.dashboard_id);
  },
  setupController(controller, model) {
    this._super(controller, model);
    console.log(model.toJSON());
    if (model != null) {
      console.log("Setting controller for dash");
      controller.set('name', model.get('name'));
      console.log(model.get('name'));
    }
  }
});
