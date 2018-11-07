// @flow

import { denormalize } from 'normalizr';
import compare_desc from 'date-fns/compare_desc';
import { ConversationSchema, DetailSchema } from './schemas';
import { type StoreState } from './types';
import { type ConversationState } from '../types';

export const select = {
  connected(state: StoreState) {
    return state.connected;
  },

  draft(state: StoreState) {
    return state.draft;
  },

  activeConversationId(state: StoreState): void | string {
    return state.activeConversationId;
  },

  conversations: (state: StoreState) => {
    return (
      denormalize(state.conversations, [ConversationSchema], state.entities) ||
      []
    ).sort((a, b) =>
      compare_desc(a.last_message.timestamp, b.last_message.timestamp)
    );
  },

  conversationSlim: (
    state: StoreState,
    params: { conversation_id: string }
  ) => {
    const conversations = select.conversations(state);
    return conversations.find(conv => conv.id === params.conversation_id);
  },

  conversationDetail(
    state: StoreState,
    params: { conversation_id: void | string }
  ): void | ConversationState {
    if (
      params.conversation_id &&
      state.entities.details[params.conversation_id]
    ) {
      return denormalize(params.conversation_id, DetailSchema, state.entities);
    }
    return undefined;
  },

  searchedUsers(state: StoreState) {
    return state.usersInSearch;
  },

  viewer(state: StoreState) {
    return state.viewer;
  },
};
