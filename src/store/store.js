// @flow

import { createStore, applyMiddleware, type Store } from 'redux';
import { reducer } from './reducer';
import { socketMessageDispatcher } from './socket-message-dispatcher';
import type { Action } from './actions';
import type { State } from '../types';

export type StoreInstance = Store<State, Action>;
export const store: StoreInstance = createStore(reducer, applyMiddleware(socketMessageDispatcher));
