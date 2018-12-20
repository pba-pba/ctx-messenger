// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';

import { ConnectionGate } from '../ConnectionGate';
import { searchConversationsByTerm } from '../store/actions';

type CP = {
  searchConversationsByTerm(term: string): mixed,
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
});

export const DispacherManager = connect(mapState, mapDispatch)(Renderer);
