import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    this.set('dash',this.modelFor("editor/dashboard"));
    
    return this.get('dash.pages').then((pages) => {
      console.log(pages);
      let fpage = null;
      pages.forEach((page) => {
        if (page == null) {
          return false;
        }
        console.log(page);
        if(page.id == params.page_id) {
          console.log("found");
          fpage = page;
          return false;
        }
      });
      return fpage
    }).then((fpage) => {
      if (fpage != null) console.log(fpage.toJSON());
      return fpage;
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
      console.log("Setting controller");
      console.log(controller);
      controller.set('name', model.get('name'));
      controller.set('timeout', model.get('timeout'));
      controller.set('number', model.get('number'));
    }
  }
});
