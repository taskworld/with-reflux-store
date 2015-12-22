const React = require('react')
const Reflux = require('reflux')
const invariant = require('invariant')

const validateStore = store => invariant(store.listen, 'Expected a Reflux store')
const coerceToArray = value => Array.isArray(value) ? value : [ value ]

const wrapWithRefluxStore = (stores, getProps, Component) => (
  stores.forEach(validateStore),
  React.createClass({
    mixins: stores.map(store => Reflux.listenTo(store, 'onStoreChange')),
    onStoreChange () {
      this.forceUpdate()
    },
    render () {
      return (<Component {...this.props} {...getProps(this.props)} />)
    },
  })
)

const withRefluxStore = (stores, getProps) => (
  Component => wrapWithRefluxStore(coerceToArray(stores), getProps, Component)
)

module.exports = withRefluxStore

