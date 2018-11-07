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
  online: boolean,
};

export type ChatContact = {
  user: ChatUser,
  online: boolean,
};

export type ChatMessageType = 'sent_message' | 'received_message';

export type ChatMessage = {
  body: string,
  conversation_id: string,
  id: string,
  timestamp: string,
  user: ChatUser,
  client_message_id: string,
  message_type: 'text',
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

export type ChatState = {
  activeConversationId: void | string,
  connected: boolean,
  conversations: void | Array<ChatConversationSlim>,
  draft: void | Object,
  entities: { conversations: {}, users: {} },
  usersInSearch: ChatUser[],
  viewer: void | ChatUser,
};

export type ChatActions = {
  cancelSubToAppearanceStatus(): mixed,
  cancelSubToConversation(id: string): mixed,
  cancelSubToSubscriptionsChannel(): mixed,
  createConversation(ids: Array<string>, message: string): mixed,
  createSubToAppearanceStatus(): mixed,
  createSubToConversation(id: string): mixed,
  createSubToSubscriptionsChannel(): mixed,
  sendChatMessage(chatMessage: ChatMessage): mixed,
  searchUsersByTerm(term: string): mixed,
  createSubToUsersChannel(): mixed,
  cancelSubToUsersChannel(): mixed,
};

/**
 * Action send from client and received from socket server.
 */
export type ClientAction =
  | { type: 'set_active_conversion', conversation_id: string }
  | { type: 'send_chat_message', message: ChatMessage }
  | { type: 'request_next_messages', conversation_id: string }
  | { type: 'request_search_users', term: string }
  | { type: 'set_draft', draft: Object };

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
  | {
      type: 'replace_appearance_status',
      users: { user: ChatUser, online: boolean }[],
    }
  | { type: 'merge_chat_message', message: ChatMessage }
  | { type: 'search_users', result: { term: string, users: ChatUser[] } };

/**
 * Parsed response from socked server
 */
export type SocketResponse = {
  type?: string,
  identifier?: string,
  message?: SocketAction,
};
