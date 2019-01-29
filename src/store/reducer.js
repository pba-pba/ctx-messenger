// @flow

import { normalize } from 'normalizr';
import update from 'immutability-helper';
import { ConversationSchema, DetailSchema } from './schemas';
import { select } from './select';
import type { Action } from './actions';
import type { State } from '../types';

const InitialState: State = {
  notifications: { unread_count: 0 },
  activeConversationId: undefined,
  connected: false,
  conversations: undefined,
  draft: undefined,
  entities: { conversations: {}, users: {}, messages: {}, details: {} },
  usersInSearch: [],
  viewer: undefined,
  loading: { get_messages: false, merge_conversations: false, replace_conversations: false },
};

export function reducer(state: State = InitialState, action: Action) {
  switch (action.type) {
    case 'clear': {
      return InitialState;
    }

    case 'loading': {
      return update(state, { loading: { $merge: action.payload } });
    }

    case 'welcome': {
      return update(state, { connected: { $set: true } });
    }

    case 'replace_self_info': {
      return update(state, { viewer: { $set: action.user } });
    }

    case 'confirm_subscription': {
      const { identifier } = action;
      if (identifier.channel === 'ConversationsChannel') {
        return update(state, {
          activeConversationId: { $set: identifier.conversation_id },
          draft: { $set: undefined },
        });
      }
      return state;
    }

    case 'merge_conversations': {
      const { result, entities } = normalize(action.result.conversations, [ConversationSchema]);
      return update(state, {
        conversations: (slice = []) => Array.from(new Set([...result, ...slice])),
        entities: {
          conversations: { $merge: entities.conversations || {} },
          users: { $merge: entities.users || {} },
        },
        loading: { $merge: { conversations: false } },
      });
    }

    case 'replace_conversations': {
      const { result, entities } = normalize(action.result.conversations, [ConversationSchema]);
      return update(state, {
        conversations: { $set: result },
        entities: {
          conversations: { $set: entities.conversations || {} },
          users: { $set: entities.users || {} },
        },
        loading: { $merge: { conversations: false } },
      });
    }

    /**
     * Messages
     */
    case 'push_messages': {
      const detail = select.conversationDetail(state, {
        conversation_id: action.result.conversation_id,
      });

      const mutation = action.result.cursor ? '$push' : '$set';
      const partialResult = update(detail || {}, {
        messages: { [mutation]: action.result.messages },
      });
      const { entities } = normalize(
        {
          ...action.result,
          messages: partialResult.messages,
          endReached: action.result.messages.length < action.result.limit,
        },
        DetailSchema,
      );
      return update(state, {
        entities: { $merge: entities },
        loading: { $merge: { get_messages: false } },
      });
    }

    case 'unshift_messages': {
      let detail = select.conversationDetail(state, {
        conversation_id: action.result.conversation_id,
      });
      // $FlowFixMe
      detail.messages = action.result.messages.concat(detail.messages);
      const { entities } = normalize(detail, DetailSchema);
      return update(state, { entities: { $merge: entities } });
    }

    /**
     * New conversation
     */
    case 'set_draft': {
      return update(state, {
        activeConversationId: { $set: undefined },
        draft: { $set: action.draft },
      });
    }

    case 'search_users': {
      return update(state, { usersInSearch: { $set: action.result.users } });
    }

    /**
     * Notifications
     */
    case 'badge_notifications': {
      return update(state, { notifications: { $set: action.result } });
    }

    default:
      return state;
  }
}
