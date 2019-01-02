// @flow

import { normalize } from 'normalizr'
import update from 'immutability-helper'
import { ConversationSchema, DetailSchema } from './schemas'
import { select } from './select'
import type { Action } from './actions'
import type { State } from '../types'

const InitialState: State = {
  activeConversationId: undefined,
  connected: false,
  conversations: undefined,
  draft: undefined,
  entities: { conversations: {}, users: {}, messages: {}, details: {} },
  usersInSearch: [],
  viewer: undefined
}

export function reducer(state: State = InitialState, action: Action) {
  switch (action.type) {
    case 'welcome': {
      return update(state, { connected: { $set: true } })
    }

    case 'replace_self_info': {
      return update(state, { viewer: { $set: action.user } })
    }

    case 'confirm_subscription': {
      const { identifier } = action
      if (identifier.channel === 'ConversationsChannel') {
        return update(state, {
          activeConversationId: { $set: identifier.conversation_id },
          draft: { $set: undefined }
        })
      }
      return state
    }

    case 'merge_conversations': {
      const { result, entities } = normalize(action.result.conversations, [ConversationSchema])
      return update(state, {
        conversations: (slice = []) => Array.from(new Set([...result, ...slice])),
        entities: {
          conversations: { $merge: entities.conversations || {} },
          users: { $merge: entities.users || {} }
        }
      })
    }

    /**
     * Messages
     */
    case 'push_messages': {
      const detail = select.conversationDetail(state, {
        conversation_id: action.result.conversation_id
      })
      const mutation = action.result.cursor ? '$push' : '$set'
      const partialResult = update(detail || {}, {
        messages: { [mutation]: action.result.messages }
      })
      const { entities } = normalize(
        {
          ...action.result,
          messages: partialResult.messages,
          endReached: action.result.messages.length < action.result.limit
        },
        DetailSchema
      )
      return update(state, { entities: { $merge: entities } })
    }

    case 'unshift_messages': {
      let detail = select.conversationDetail(state, {
        conversation_id: action.result.conversation_id
      })
      // $FlowFixMe
      detail.messages = action.result.messages.concat(detail.messages)
      const { entities } = normalize(detail, DetailSchema)
      return update(state, { entities: { $merge: entities } })
    }

    /**
     * New conversation
     */
    case 'set_draft': {
      return update(state, {
        activeConversationId: { $set: undefined },
        draft: { $set: action.draft }
      })
    }

    case 'search_users': {
      return update(state, { usersInSearch: { $set: action.result.users } })
    }

    default:
      return state
  }
}
