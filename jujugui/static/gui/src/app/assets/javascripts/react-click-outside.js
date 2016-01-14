// Copied from: https://github.com/kentor/react-click-outside/blob/master/dist/index.js
// Changes noted below.

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// XXX huwshimi 14 Jan 2016 - Remove require calls as the libs are already loaded.
// var React = require('react');
// var ReactDOM = require('react-dom');

// XXX huwshimi 14 Jan 2016 Don't assign function to module.exports.
function enhanceWithClickOutside(WrappedComponent) {
  var componentName = WrappedComponent.displayName || WrappedComponent.name;

  return React.createClass({
    displayName: 'Wrapped' + componentName,

    componentDidMount: function componentDidMount() {
      this.__wrappedComponent = this.refs.wrappedComponent;
      document.addEventListener('click', this.handleClickOutside, true);
    },

    componentWillUnmount: function componentWillUnmount() {
      document.removeEventListener('click', this.handleClickOutside, true);
    },

    handleClickOutside: function handleClickOutside(e) {
      var domNode = ReactDOM.findDOMNode(this);
      if ((!domNode || !domNode.contains(e.target)) && typeof this.refs.wrappedComponent.handleClickOutside === 'function') {
        this.refs.wrappedComponent.handleClickOutside(e);
      }
    },

    render: function render() {
      return React.createElement(WrappedComponent, _extends({}, this.props, { ref: 'wrappedComponent' }));
    }
  });
};
