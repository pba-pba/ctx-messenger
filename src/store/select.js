// @flow

import { denormalize } from 'normalizr';
import { ConversationSchema, DetailSchema, UserSchema } from './schemas';
import { type State } from './reducer';
import { type ConversationState } from '../types';

export const select = {
  connected(state: State) {
    return state.connected;
  },

  loading(state: State, key: string): boolean {
    if (key) {
      return state.loading[key];
    }

    return state.loading;
  },

  draft(state: State) {
    return state.draft;
  },

  activeConversationId(state: State): void | string {
    return state.activeConversationId;
  },

  conversations: (state: State) => {
    return denormalize(state.conversations, [ConversationSchema], state.entities) || [];
  },

  users: (state: State) => {
    return denormalize(state.users, [UserSchema], state.entities) || [];
  },

  searchConversationQuery: (state: State) => {
    return state.search_conversation_query;
  },

  conversationSlim: (state: State, params: { conversation_id: string }) => {
    const conversations = select.conversations(state) || [];
    return conversations.find(conv => conv.id === params.conversation_id);
  },

  conversationDetail(
    state: State,
    params: { conversation_id: void | string },
  ): void | ConversationState {
    if (params.conversation_id && state.entities.details[params.conversation_id]) {
      return denormalize(params.conversation_id, DetailSchema, state.entities);
    }
    return undefined;
  },

  searchedUsers(state: State) {
    return state.usersInSearch;
  },

  viewer(state: State) {
    return state.viewer;
  },

  notifications(state: State) {
    return state.notifications;
  },

  channels(state: State) {
    return state.channels;
  },
};
