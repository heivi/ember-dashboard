import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

// Luodaan valikko sivujen välillä siirtymiseen
export default Component.extend({
  session: service('session'),
  init() {
    this._super(...arguments);
  },
  didReceiveAttrs() {
    let pages = [
      {
        text: "Etusivu",
        route: "index",
        current: computed('params.[]', function(){
          return this.get('params')[0];
        }) == "index"
      },
      
    ];
    console.log(this.get('session.isAuthenticated'))
    if (this.get('session.isAuthenticated') == false) {
      /*pages.push({
        text: "Rekisteröidy",
        route: "register",
        current: computed('params.[]', function(){
          return this.get('params')[0];
        }) == "register"
      });*/
      pages.push({
        text: "Kirjaudu",
        route: "login",
        current: computed('params.[]', function(){
          return this.get('params')[0];
        }) == "login"
      });
    } else {
      pages.push({
        text: "Editor",
        route: "editor",
        current: computed('params.[]', function(){
          return this.get('params')[0];
        }) == "editor"
      });
      
      pages.push({
        text: "Kirjaudu ulos",
        route: "logout",
        current: computed('params.[]', function(){
          return this.get('params')[0];
        }) == "logout"
      });
    }
    
    this.set('pages', pages);
  }
}).reopenClass({
  positionalParams: 'params'
});
