import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | editor/dashboard/index', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:editor/dashboard/index');
    assert.ok(controller);
  });
});
