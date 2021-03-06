// @flow

import type { ChatMessage, MessageBatchRequest } from '../types';

/**
 * Channels
 */
// Subscriptions channel
export function createSubToSubscriptionsChannel() {
  return { command: 'subscribe', identifier: { channel: 'SubscriptionsChannel' } };
}

export function cancelSubToSubscriptionsChannel() {
  return { command: 'unsubscribe', identifier: { channel: 'SubscriptionsChannel' } };
}

// Users channel
export function createSubToUsersChannel() {
  return { command: 'subscribe', identifier: { channel: 'UsersChannel' } };
}

export function cancelSubToUsersChannel() {
  return { command: 'unsubscribe', identifier: { channel: 'UsersChannel' } };
}

// Appearance status
export function createSubToAppearanceStatus() {
  return { command: 'subscribe', identifier: { channel: 'AppearancesChannel' } };
}

export function cancelSubToAppearanceStatus() {
  return { command: 'unsubscribe', identifier: { channel: 'AppearancesChannel' } };
}

// Conversation detail
export function createSubToConversation(id: string) {
  return {
    command: 'subscribe',
    identifier: { channel: 'ConversationsChannel', conversation_id: id },
  };
}

export function cancelSubToConversation(id: string) {
  return {
    command: 'unsubscribe',
    identifier: { channel: 'ConversationsChannel', conversation_id: id },
  };
}

/**
 * Messages
 */
export function searchUsersByTerm(term: string) {
  return {
    command: 'message',
    identifier: { channel: 'UsersChannel' },
    data: {
      action: 'search_users',
      payload: { term: term },
    },
  };
}

export function sendChatMessage(chatMessage: ChatMessage) {
  return {
    command: 'message',
    identifier: { channel: 'ConversationsChannel', conversation_id: chatMessage.conversation_id },
    data: {
      action: 'send_message',
      payload: chatMessage,
    },
  };
}

export function requestMessagesBatch(request: MessageBatchRequest) {
  return {
    command: 'message',
    identifier: { channel: 'ConversationsChannel', conversation_id: request.conversation_id },
    data: {
      action: 'get_messages',
      payload: {
        conversation_id: request.conversation_id,
        limit: request.limit,
        cursor: request.cursor,
      },
    },
  };
}

export function readChatMessages(conversation_id: string) {
  return {
    command: 'message',
    identifier: { channel: 'ConversationsChannel', conversation_id: conversation_id },
    data: {
      action: 'read_messages',
      payload: {
        conversation_id: conversation_id,
      },
    },
  };
}

/**
 * Conversations
 */
export function createConversation(userIds: Array<string>, message: ChatMessage) {
  return {
    command: 'message',
    identifier: { channel: 'SubscriptionsChannel' },
    data: {
      action: 'create_conversation',
      payload: {
        userIds: userIds,
        message: message,
      },
    },
  };
}

export function createConversationForRemoteUsers(
  remoteUserIds: Array<string>,
  message: ChatMessage,
) {
  return {
    command: 'message',
    identifier: { channel: 'SubscriptionsChannel' },
    data: {
      action: 'create_conversation',
      payload: {
        remoteUserIds: remoteUserIds,
        message: message,
      },
    },
  };
}

export function searchConversationsByTerm(term: string) {
  return {
    command: 'message',
    identifier: { channel: 'SubscriptionsChannel' },
    data: {
      action: 'search_conversations',
      payload: { term: term },
    },
  };
}

export function globalSearchByTerm(term: string) {
  return {
    command: 'message',
    identifier: { channel: 'SubscriptionsChannel' },
    data: {
      action: 'global_search',
      payload: { term: term },
    },
  };
}

export function searchConversationsByUsers(users: string) {
  return {
    command: 'message',
    identifier: { channel: 'SubscriptionsChannel' },
    data: {
      action: 'search_conversations',
      payload: { users: users },
    },
  };
}
