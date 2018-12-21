// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';

import { ConnectionGate } from '../ConnectionGate';
import { searchConversationsByTerm, searchUsersByTerm, setDraft, sendMessage, createConversation} from '../store/actions';

type CP = {
  searchConversationsByTerm(term: string): mixed,
  searchUsersByTerm(term: string): mixed,
  setDraft(draft: any): mixed,
  sendMessage(data: *): mixed,
};

type Props = {
  children(CP): React.Node,
};

function Renderer(props: Props & CP) {
  return (
    <ConnectionGate>
      {gate => props.children(props)}
    </ConnectionGate>
  );
}

const mapState = (state, props) => ({});

const mapDispatch = (dispatch: Dispatch<*>, ownProps) => ({
  searchConversationsByTerm: term => dispatch(searchConversationsByTerm(term)),
  searchUsersByTerm: term => dispatch(searchUsersByTerm(term)),
  setDraft: draft => dispatch(setDraft(draft)),
  sendMessage: data => dispatch(sendMessage(data)),
  createConversation: data => dispatch(createConversation(data)),
});

export const DispacherManager = connect(mapState, mapDispatch)(Renderer);
