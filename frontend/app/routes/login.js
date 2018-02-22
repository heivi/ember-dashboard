import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
  actions: {
    signInViaFacebook: function(){
      var route = this,
          controller = this.controllerFor('login');
      // The provider name is passed to `open`
      this.get('session').open('facebook-connect').then(function(){
        route.transitionTo('index');
        route.refresh();
      }, function(error){
        controller.set('error', 'Could not sign you in: '+error.message);
      });
    }
  }
});
