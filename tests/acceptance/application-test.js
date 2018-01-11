/* global visit, andThen, find, currentPath */

import Ember from 'ember'
import { module, test } from 'qunit'
import startApp from '../helpers/start-app'

const { run } = Ember

let application

function getCssProperty (element, property) {
  let elem = document.getElementById(element)
  return window.getComputedStyle(elem, null).getPropertyValue(property)
}

module('Acceptance: Application (Chrome Only)', {
  beforeEach () {
    application = startApp()
  },
  afterEach () {
    run(application, 'destroy')
  }
})

// Execute this test in Chrome or PhantomJS for correct results
test('Verify postcss has run', (assert) => {
  assert.expect(4)

  visit('/test')
  andThen(function () {
    assert.equal(currentPath(), 'test', 'On the index page')
    assert.equal(find('#test-title').length, 1, 'Page contains a header title')
    assert.equal(getCssProperty('test-title', 'color'), 'rgb(10, 10, 10)', 'postcss-color-gray has run on title')
    assert.equal(getCssProperty('test-paragraph', 'color'), 'rgb(255, 0, 0)', 'postcss-color-gray has run on paragraph')
  })
})

test('Verify additional files can be compiled', (assert) => {
  assert.expect(2)

  visit('/test')
  andThen(function () {
    assert.equal(currentPath(), 'test', 'On the index page')
    assert.equal(getCssProperty('test-paragraph', 'margin-bottom'), '45px', 'secondary.css has been processed')
  })
})
