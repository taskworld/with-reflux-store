'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Reflux = require('reflux');
var invariant = require('invariant');

var validateStore = function validateStore(store) {
  return invariant(store.listen, 'Expected a Reflux store');
};
var coerceToArray = function coerceToArray(value) {
  return Array.isArray(value) ? value : [value];
};

var wrapWithRefluxStore = function wrapWithRefluxStore(stores, getProps, Component) {
  return stores.forEach(validateStore), React.createClass({
    mixins: stores.map(function (store) {
      return Reflux.listenTo(store, 'onStoreChange');
    }),
    onStoreChange: function onStoreChange() {
      this.forceUpdate();
    },
    render: function render() {
      return React.createElement(Component, _extends({}, this.props, getProps(this.props)));
    }
  });
};

var withRefluxStore = function withRefluxStore(stores, getProps) {
  return function (Component) {
    return wrapWithRefluxStore(coerceToArray(stores), getProps, Component);
  };
};

module.exports = withRefluxStore;
