// @flow

import { store } from './store';
import { select } from './select';
import type { ClientAction, SocketAction } from '../types';

export type Action = ClientAction | SocketAction;

export function clear() {
  return { type: 'clear' };
}

export function loading(data) {
  return { type: 'loading', payload: data };
}

export function setActiveConverstation(conversation_id: string): ClientAction {
  return { type: 'set_active_conversion', conversation_id: conversation_id };
}

export function searchUsersByTerm(term: string): ClientAction {
  return { type: 'request_search_users', term: term };
}

export function searchConversationsByTerm(term: string): ClientAction {
  return { type: 'request_search_conversations', term: term };
}

export function setDraft(draft: Object): ClientAction {
  return { type: 'set_draft', draft: draft };
}

export function createConversation(): ClientAction {
  return { type: 'set_draft', draft: { users: [], id: undefined } };
}

export function sendMessage(data: { body: string, attachments: Array<string> }): ClientAction {
  const conversation_id = select.activeConversationId(store.getState());
  const draft = select.draft(store.getState());

  const msg = {
    message_type: 'text',
    ...data,
    // $FlowExpectedError
    user: select.viewer(store.getState()),
    client_message_id: new Date().getTime().toString(),
    // $FlowExpectedError
    conversation_id: conversation_id,
    id: '',
    timestamp: new Date().toString(),
  };

  if (conversation_id) {
    return {
      type: 'send_chat_message',
      // $FlowExpectedError
      message: msg,
    };
  }

  if (draft) {
    return {
      type: 'create_conversation',
      payload: {
        message: msg,
        users: draft.users.map(user => user.id),
      },
    };
  }

  return { type: 'messenger:unknown-action' };
}
