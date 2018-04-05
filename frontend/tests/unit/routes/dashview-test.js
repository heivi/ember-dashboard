import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | dashview', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:dashview');
    assert.ok(route);
  });
});
