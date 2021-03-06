import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('register');
  this.route('login');
  this.route('editor', function() {
    this.route('new');
    this.route('dashboard', { path: '/:dashboard_id' }, function() {
      this.route('new');
      this.route('page', { path: '/:page_id' }, function() {
        this.route('new');
        this.route('component', { path: '/:component_id' });
        
      });
    });

    
  });
  this.route('logout');

  this.route('dashview', function() {
    this.route('dashboard', { path: '/:dashboard_id' });
  });
});

export default Router;
