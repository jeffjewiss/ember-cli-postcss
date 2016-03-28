import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;

function getCssProperty(element, property) {
  var elem = document.getElementById(element);
  return window.getComputedStyle(elem, null).getPropertyValue(property);
}

module('Acceptance: Application (Chrome Only)', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

/**
  Execute this test in Chrome or PhantomJS for correct results
*/
test('Verify postcss has run', function(assert) {
  assert.expect(4);

  visit('/');
  andThen(function() {
    assert.equal(currentPath(), 'index', "On the index page");
    assert.equal(find('#title').length, 1, "Page contains a header title");
    assert.equal(getCssProperty('title', 'color'), 'rgb(0, 0, 0)', 'postcss-color-gray has run');
    assert.equal(getCssProperty('paragraph', 'color'), 'rgb(102, 51, 153)', 'postcss-rebeccapurple has run');
  });
});
