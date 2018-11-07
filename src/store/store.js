// @flow

import { createStore, applyMiddleware, type Store } from 'redux';
import { reducer, type StoreState } from './reducer';
import type { Action } from './actions';
import { socketMessageDispatcher } from './socket-message-dispatcher';

export type StoreInstance = Store<StoreState, Action>;
export const store: StoreInstance = createStore(
  reducer,
  applyMiddleware(socketMessageDispatcher)
);
