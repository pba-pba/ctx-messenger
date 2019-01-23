// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';

import { ConnectionGate } from '../ConnectionGate';
import {
  clear,
  createConversation,
  searchConversationsByUsers,
  searchConversationsByTerm,
  searchUsersByTerm,
  sendMessage,
  setDraft,
} from '../store/actions';

type CP = {
  clear(): mixed,
  searchConversationsByUsers(users: *): mixed,
  searchConversationsByTerm(term: string): mixed,
  searchUsersByTerm(term: string): mixed,
  sendMessage(data: *): mixed,
  setDraft(draft: any): mixed,
};

type Props = {
  children(CP): React.Node,
};

function Renderer(props: Props & CP) {
  return <ConnectionGate>{gate => props.children(props)}</ConnectionGate>;
}

const mapState = (state, props) => ({});

const mapDispatch = (dispatch: Dispatch<*>, ownProps) => ({
  searchConversationsByTerm: term => dispatch(searchConversationsByTerm(term)),
  searchUsersByTerm: term => dispatch(searchUsersByTerm(term)),
  searchConversationsByUsers: users => dispatch(searchConversationsByUsers(users)),
  setDraft: draft => {
    dispatch(searchConversationsByUsers(draft.users));
    dispatch(setDraft(draft));
  },
  sendMessage: data => dispatch(sendMessage(data)),
  createConversation: data => dispatch(createConversation(data)),
  clear: () => dispatch(clear()),
});

export const DispacherManager = connect(
  mapState,
  mapDispatch,
)(Renderer);
