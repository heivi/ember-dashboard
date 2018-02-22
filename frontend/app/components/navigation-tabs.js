import Component from '@ember/component';
import { computed } from '@ember/object';

// Luodaan valikko sivujen välillä siirtymiseen
export default Component.extend({
  init() {
    this._super(...arguments);
    this.pages = [
      {
        text: "Etusivu",
        route: "index",
        current: computed('params.[]', function(){
          return this.get('params')[0];
        }) == "index"
      },
      {
        text: "Rekisteröidy",
        route: "register",
        current: computed('params.[]', function(){
          return this.get('params')[0];
        }) == "register"
      },
      {
        text: "Kirjaudu",
        route: "login",
        current: computed('params.[]', function(){
          return this.get('params')[0];
        }) == "login"
      }
    ];
  }
}).reopenClass({
  positionalParams: 'params'
});
