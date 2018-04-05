import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    this.set('dash',this.modelFor("editor/dashboard"));
    return this.get('dash');
    /*return this.get('dash').then(function(dashboard) {
      dashboard.get('pages').find(function(page) {
        return page.get('id') == params.page_id;
      });
    });*/
  }
});
