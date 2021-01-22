import { module, test } from 'qunit';
import { visit, findAll, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

function getCssProperty(element, property) {
  const elem = document.getElementById(element);
  return window.getComputedStyle(elem, null).getPropertyValue(property);
}

module('Acceptance | Application', function (hooks) {
  setupApplicationTest(hooks);

  test('Verify postcss has run', async function (assert) {
    assert.expect(4);

    await visit('/test');

    assert.equal(currentRouteName(), 'test', 'On the index page');
    assert.equal(
      findAll('#test-title').length,
      1,
      'Page contains a header title'
    );
    assert.equal(
      getCssProperty('test-title', 'color'),
      'rgb(27, 27, 27)',
      'postcss-color-gray has run on title'
    );
    assert.equal(
      getCssProperty('test-paragraph', 'color'),
      'rgb(255, 0, 0)',
      'postcss-color-gray has run on paragraph'
    );
  });

  test('Verify additional files can be compiled', async function (assert) {
    assert.expect(2);

    await visit('/test');

    assert.equal(currentRouteName(), 'test', 'On the index page');
    assert.equal(
      getCssProperty('test-paragraph', 'margin-bottom'),
      '45px',
      'secondary.css has been processed'
    );
  });
});
