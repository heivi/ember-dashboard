import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    this.set('page',this.modelFor("editor/dashboard/page"));
    
    return this.get('page.components').then((components) => {
      console.log(components);
      let fcompo = null;
      components.forEach((compo) => {
        if (compo == null) {
          return false;
        }
        console.log(compo);
        if(compo.id == params.component_id) {
          console.log("compo found");
          fcompo = compo;
          return false;
        }
      });
      return fcompo
    }).then((fcompo) => {
      console.log(fcompo.toJSON());
      return fcompo;
    });
    
    /*return this.get('dash').then(function(dashboard) {
      dashboard.get('pages').find(function(page) {
        return page.get('id') == params.page_id;
      });
    });*/
  }
});
