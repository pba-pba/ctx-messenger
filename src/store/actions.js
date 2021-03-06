// @flow

import { store } from './store';
import { select } from './select';
import type { ClientAction, SocketAction, ChatContact } from '../types';

export type Action = ClientAction | SocketAction;

export function clear() {
  return { type: 'clear' };
}

export function loading(data) {
  return { type: 'loading', payload: data };
}

export function unsubscribe(data) {
  return { type: 'unsubscribe', identifier: data };
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

export function globalSearchByTerm(term: string): ClientAction {
  return { type: 'request_global_search', term: term };
}

export function searchConversationsByUsers(users: string): ClientAction {
  return { type: 'request_search_conversations_by_users', users: users };
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

export function sendMessageForRemoteUsers(
  data: {
    body: string,
    attachments: string[],
  },
  remoteUsers: ChatContact[],
): ClientAction {
  // const msg = {
  //   message_type: 'text',
  //   ...data,
  //   // $FlowExpectedError
  //   user: select.viewer(store.getState()),
  //   client_message_id: new Date().getTime().toString(),
  //   // $FlowExpectedError
  //   conversation_id: undefined,
  //   id: '',
  //   timestamp: new Date().toString(),
  // };

  return {
    type: 'create_conversation_for_remote_users',
    payload: {
      // message: msg,
      users: remoteUsers.map(user => user.id),
    },
  };
}
