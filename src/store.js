import throttle from 'lodash/throttle'
import { createStore } from 'redux'
import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import rootReducer from './reducers'
import { loadState, saveState } from './middleware/localStorage'

const persistedState = loadState()

const store = createStore(rootReducer, persistedState, window.devToolsExtension && window.devToolsExtension())

store.subscribe(throttle(() => {
  saveState(store.getState())
}))

const history = syncHistoryWithStore(hashHistory, store)

export { store, history }
