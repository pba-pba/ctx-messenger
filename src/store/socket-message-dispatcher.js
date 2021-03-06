// @flow

import { dispatchSocketMessage } from '../ConnectionManager/Connection';
import * as ws from '../ConnectionManager/messages';
// import { select } from './select';
import type { Action } from './actions';

export const socketMessageDispatcher = (store: *) => (next: *) => (action: Action) => {
  switch (action.type) {
    case 'confirm_subscription': {
      const { identifier } = action;
      if (identifier.channel === 'ConversationsChannel') {
        // const detail = select.conversationDetail(store.getState(), {
        //   conversation_id: identifier.conversation_id,
        // });

        // if (detail === undefined) {
        dispatchSocketMessage(
          ws.requestMessagesBatch({
            // $FlowExpectedError
            conversation_id: identifier.conversation_id,
            limit: 20,
            cursor: undefined,
          }),
        );
        // }
      }

      return next(action);
    }

    // Send message to server
    case 'send_chat_message': {
      dispatchSocketMessage(ws.sendChatMessage(action.message));
      return next(action);
    }

    case 'create_conversation': {
      dispatchSocketMessage(ws.createConversation(action.payload.users, action.payload.message));
      return next(action);
    }

    case 'create_conversation_for_remote_users': {
      dispatchSocketMessage(
        ws.createConversationForRemoteUsers(action.payload.users, action.payload.message),
      );
      return next(action);
    }

    // Search users
    case 'request_search_users': {
      dispatchSocketMessage(ws.searchUsersByTerm(action.term));
      return next(action);
    }

    // Search conversations
    case 'request_search_conversations': {
      dispatchSocketMessage(ws.searchConversationsByTerm(action.term));
      return next(action);
    }

    // Global search
    case 'request_global_search': {
      dispatchSocketMessage(ws.globalSearchByTerm(action.term));
      return next(action);
    }

    case 'request_search_conversations_by_users': {
      dispatchSocketMessage(ws.searchConversationsByUsers(action.users));
      return next(action);
    }

    default:
      return next(action);
  }
};
