//  @flow

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import { compact } from 'lodash';
import logger from 'redux-logger';
import { composeWithDevTools } from 'remote-redux-devtools';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import sagas from './sagas';

// change context types in ReduxWrapper.js
export default function initializeStore() {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = compact([
    thunk.withExtraArgument({}),
    sagaMiddleware,
    __DEV__ ? logger : null,
  ]);

  let debuggWrapper = data => data;
  if (__DEV__) {
    debuggWrapper = composeWithDevTools({
      realtime: true,
      port: 8000,
      suppressConnectErrors: false,
    });
  }

  const store = createStore(
    rootReducer,
    {},
    debuggWrapper(compose(applyMiddleware(...middlewares))),
  );

  persistStore(store, null, () => {
    store.getState();
  });

  sagaMiddleware.run(sagas);

  return store;
}
