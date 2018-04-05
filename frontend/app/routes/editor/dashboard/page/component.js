import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    this.set('page',this.modelFor("editor/dashboard/page"));
    
    return this.get('page.components').then((components) => {
      console.log("components:");
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
      if (fcompo != null) console.log(fcompo.toJSON());
      return fcompo;
    });
    
    /*return this.get('dash').then(function(dashboard) {
      dashboard.get('pages').find(function(page) {
        return page.get('id') == params.page_id;
      });
    });*/
  },
  setupController(controller, model) {
    this._super(controller, model);
    if (model != null) {
      controller.set('name', model.get('name'));
      controller.set('minWidth', model.get('minWidth'));
      controller.set('minHeight', model.get('minHeight'));
      controller.set('height', model.get('height'));
      controller.set('width', model.get('width'));
      controller.set('type', model.get('type'));
      controller.set('public', model.get('public'));
      controller.set('componentData', model.get('componentData'));
      controller.set('triggers', model.get('triggers'));
      controller.set('classes', model.get('classes'));
    }
  }
});
