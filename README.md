# with-reflux-store

A higher-order-component to make it easy to subscribe to Reflux store.

This is an example of a React component that listens to a Reflux store.

```js
const CurrentUserName = React.createClass({
  mixins: [
    Reflux.listenTo(UserStore, 'onStoreChange')
  ],
  getInitialState () {
    const user = UserStore.getCurrentUser()
    return { name: user ? user.name : 'Guest' }
  },
  onStoreChange () {
    const user = UserStore.getCurrentUser()
    this.setState({ name: user ? user.name : 'Guest' })
  },
  render () {
    return <span className='UserName'>{this.state.name}</span>
  }
})
```

That’s a lot of code for such a simple component.

By the way, there’s some duplicate code, let’s refactor it slightly.

```js
const CurrentUserName = React.createClass({
  mixins: [
    Reflux.listenTo(UserStore, 'onStoreChange')
  ],
  getInitialState () {
    return this.getStateFromStore()
  },
  onStoreChange () {
    this.setState(this.getStateFromStore())
  },
  getStateFromStore () {
    const user = UserStore.getCurrentUser()
    return { name: user ? user.name : 'Guest' }
  },
  render () {
    return <span className='UserName'>{this.state.name}</span>
  }
})
```

We ended up with more code! :(

Let’s pause that for now. We’ve learned that it’s better to separate [dumb components from smart components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.8kawafvy9):

```js
// DUMB
const UserName = (props) => (
  <span className='UserName'>{props.name}</span>
)
UserName.propTypes = { name: React.PropTypes.string.isRequired }

// SMART
const CurrentUserName = React.createClass({
  mixins: [
    Reflux.listenTo(UserStore, 'onStoreChange')
  ],
  getInitialState () {
    return this.getStateFromStore()
  },
  onStoreChange () {
    this.setState(this.getStateFromStore())
  },
  getStateFromStore () {
    const user = UserStore.getCurrentUser()
    return { name: user ? user.name : 'Guest' }
  },
  render () {
    return <UserName name={this.state.name} />
  }
})
```

That’s even more code!

We do this refactoring several times, and we start to see the pattern.
Each smart component does these:

- First, it adds Reflux.listenTo mixin.
- Second, it fetches data from store in `getInitialState`.
- Third, when store triggers, we reload the state from the store.
- Finally, we render the dumb counterpart.

This is a perfect use case for [higher-order components!](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)

With `with-reflux-store`, do this instead:

```js
const withRefluxStore = require('with-reflux-store')

// DUMB
const UserName = (props) => (
  <span className='UserName'>{props.name}</span>
)
UserName.propTypes = { name: React.PropTypes.string.isRequired }

// SMART
const CurrentUserName = withRefluxStore(UserStore, () => {
  const user = UserStore.getCurrentUser()
  return { name: user ? user.name : 'Guest' }
})(UserName)
```

Now, this is much smaller and simpler!

Usage
-----

## withRefluxStore(store: RefluxStore, fetchDataFromStore: function(props): props)(BaseComponent): WrappedComponent
