import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    return this.get('store').findRecord('dashboard',params.dashboard_id);
  },
  setupController(controller, model) {
    console.log(model.toJSON());
  }
});
