// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import { Platform } from 'react-primitives';

import { select } from '../store/select';
import { ConnectionGate } from '../ConnectionGate';
import { searchUsersByTerm, setDraft } from '../store/actions';
import { EventBinder } from '../EventBinder';
import { DispacherManager } from './DispacherManager';
import type { ChatConversationSlim, ConversationDraft, ChatUser } from '../types';

type CP = {
  draft: void | ConversationDraft,
  conversationSlim: void | ChatConversationSlim,
  searchedUsers: ChatUser[],
  viewer: ChatUser,
  searchUsersByTerm(string): mixed,
  setDraft(any): mixed,
};

type Props = {
  children(CP): React.Node,
};

function Renderer(props: Props & CP) {
  return (
    <DispacherManager>
      {({ searchUsersByTerm, ...dispatches }) => {
        const selectedUsers = (props.draft ? props.draft.users : []).map(user => user.id);
        let searchedUsers = props.searchedUsers
          .filter(user => user.id !== props.viewer.id)
          .filter(user => selectedUsers.includes(user.id) === false);
        return (
          <React.Fragment>
            <EventBinder
              didMount={() => {
                if (Platform.OS === 'web') {
                } else {
                  searchUsersByTerm('');
                }
              }}
            />
            {props.children({
              ...props,
              ...dispatches,
              searchUsersByTerm: searchUsersByTerm,
              searchedUsers: searchedUsers,
            })}
          </React.Fragment>
        );
      }}
    </DispacherManager>
  );
}

const mapState = (state, props) => ({
  conversationSlim: select.conversationSlim(state, {
    conversation_id: props.activeConversationId,
  }),
  draft: select.draft(state),
  searchedUsers: select.searchedUsers(state),
  viewer: select.viewer(state),
  loading: select.loading(state),
});

export const UserAutocompleteManager = connect(mapState)(Renderer);
