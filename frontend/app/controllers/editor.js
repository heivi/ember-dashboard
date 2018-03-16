import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  empty: computed('model', function() {
    console.log("testissä");
    this.get('store').findAll('dashboard').then((dash) => {
      return dash.get('length') < 1;
    });
    //return true;
  })
});
