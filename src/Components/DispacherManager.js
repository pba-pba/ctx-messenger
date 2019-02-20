// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';

import { select } from '../store';
import { ConnectionGate } from '../ConnectionGate';
import {
  clear,
  createConversation,
  searchConversationsByTerm,
  searchConversationsByUsers,
  searchUsersByTerm,
  sendMessage,
  sendMessageForRemoteUsers,
  setDraft,
} from '../store/actions';

import type { ChatUser } from '../types';

type CP = {
  clear(): mixed,
  searchConversationsByTerm(term: string): mixed,
  searchConversationsByUsers(users: *): mixed,
  searchUsersByTerm(term: string): mixed,
  sendMessage(data: *): mixed,
  setDraft(draft: any): mixed,
  viewer: ChatUser,
};

type Props = {
  children(CP): React.Node,
};

function Renderer(props: Props & CP) {
  return <ConnectionGate>{gate => props.children(props)}</ConnectionGate>;
}

const mapState = (state, props) => ({
  viewer: select.viewer(state),
  loading: select.loading(state),
});

const mapDispatch = (dispatch: Dispatch<*>, ownProps) => ({
  searchConversationsByTerm: term => dispatch(searchConversationsByTerm(term)),
  searchUsersByTerm: term => dispatch(searchUsersByTerm(term)),
  searchConversationsByUsers: users => dispatch(searchConversationsByUsers(users)),
  setDraft: draft => {
    if (draft) {
      dispatch(searchConversationsByUsers(draft.users));
    }
    dispatch(setDraft(draft));
  },
  sendMessage: data => dispatch(sendMessage(data)),
  createConversation: data => dispatch(createConversation(data)),
  clear: () => dispatch(clear()),
  sendMessage: (data: *) => dispatch(sendMessage(data)),
  sendMessageForRemoteUsers: (data: *, users: *) =>
    dispatch(sendMessageForRemoteUsers(data, users)),
});

export const DispacherManager = connect(
  mapState,
  mapDispatch,
)(Renderer);
