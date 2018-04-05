import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  length: computed('model', function() {
    console.log(this.get('model'));
    return -1;
    //return true;
  })
});
