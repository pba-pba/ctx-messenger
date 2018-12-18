// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';

import { select } from '../store/select';
import { ConnectionGate } from '../ConnectionGate';
import { searchUsersByTerm, setDraft } from '../store/actions';
import { EventBinder } from '../EventBinder';
import type {
  ChatConversationSlim,
  ConversationDraft,
  ChatUser
} from '../types';

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
    <ConnectionGate>
      {gate => {
        const selectedUsers = (props.draft ? props.draft.users : []).map(
          user => user.id
        );
        let searchedUsers = props.searchedUsers
          .filter(user => user.id !== props.viewer.id)
          .filter(user => selectedUsers.includes(user.id) === false);
        return (
          <React.Fragment>
            <EventBinder
              didMount={() => { props.searchUsersByTerm(''); }}
            />
            {props.children({
              ...props,
              searchedUsers: searchedUsers,
            })}
          </React.Fragment>
        );
      }}
    </ConnectionGate>
  );
}

const mapState = (state, props) => ({
  conversationSlim: select.conversationSlim(state, {
    conversation_id: props.activeConversationId,
  }),
  draft: select.draft(state),
  searchedUsers: select.searchedUsers(state),
  viewer: select.viewer(state),
});

const mapDispatch = (dispatch: Dispatch<*>, ownProps) => ({
  searchUsersByTerm: term => dispatch(searchUsersByTerm(term)),
  setDraft: draft => dispatch(setDraft(draft)),
});

export const UserAutocompleteManager = connect(mapState, mapDispatch)(Renderer);