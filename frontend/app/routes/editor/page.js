import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    return this.get('store').findRecord('dashboard',params.dashboard_id).then(function(dashboard) {
      dashboard.get('pages').find(function(page) {
        return page.get('id') == params.page_id;
      });
    });
  }
});
