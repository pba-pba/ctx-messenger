// @flow

/**
 * Chat entities
 */
export type ChatUser = {
  email: string,
  id: string,
  name: string,
  first_name: string,
  last_name: string,
  profile_photo_url: string,
  online: true,
};

export type ChatContact = {
  user: ChatUser,
  online: boolean,
};

export type ChatMessageType = 'sent_message' | 'received_message';

export type ChatMessage = {
  body: string,
  rich_body: ?string,
  conversation_id: string,
  id: string,
  timestamp: string,
  user: ChatUser,
  client_message_id: string,
  message_type: 'text' | 'call_start' | 'call_end',
};

export type MessageBatchRequest = {
  limit: number,
  cursor: void | string,
  conversation_id: string,
};

export type ConversationDraft = {
  id: void,
  last_message: null | ChatMessage,
  title: string,
  users: ChatUser[],
};

export type ChatConversationSlim = {
  id: string,
  last_message: null | ChatMessage,
  title: string,
  users: ChatUser[],
};

export type ConversationState = {
  id: string,
  loading: boolean,
  messages: ChatMessage[],
  endReached: boolean,
};

export type State = {
  notifications: { unread_count: number },
  activeConversationId: void | string,
  connected: boolean,
  conversations: void | Array<ChatConversationSlim>,
  draft: void | Object,
  entities: { conversations: {}, users: {}, details: {} },
  usersInSearch: ChatUser[],
  viewer: void | ChatUser,
  channels: {
    SubscriptionsChannel: boolean,
    UsersChannel: boolean,
    AppearancesChannel: boolean,
    ConversationsChannel: boolean,
  },
};

/**
 * Action send from client and received from socket server.
 */
export type ClientAction =
  | { type: 'set_active_conversion', conversation_id: string }
  | { type: 'send_chat_message', message: ChatMessage }
  | {
      type: 'create_conversation',
      payload: { message: ChatMessage, users: string[] },
    }
  | { type: 'request_next_messages', conversation_id: string }
  | { type: 'request_search_users', term: string }
  | { type: 'set_draft', draft: Object }
  | { type: 'messenger:unknown-action' };

export type SocketAction =
  | { type: 'welcome' }
  | {
      type: 'confirm_subscription',
      identifier: { channel: 'SubscriptionsChannel' },
    }
  | {
      type: 'confirm_subscription',
      identifier: { channel: 'ConversationsChannel', conversation_id: string },
    }
  | {
      type: 'merge_conversations',
      result: {
        conversations: ChatConversationSlim[],
        new_conversation_ids: string[],
      },
    }
  | {
      type: 'push_messages',
      result: {
        messages: ChatMessage[],
        conversation_id: string,
        cursor: void | string,
        limit: number,
      },
    }
  | {
      type: 'unshift_messages',
      result: { messages: ChatMessage[], conversation_id: string },
    }
  | { type: 'replace_self_info', user: ChatUser }
  | { type: 'search_users', result: { term: string, users: ChatUser[] } };

/**
 * Parsed response from socked server
 */
export type SocketResponse = {
  type?: string,
  identifier?: string,
  message?: SocketAction,
};
