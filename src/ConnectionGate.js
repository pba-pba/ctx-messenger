// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { select } from './store/select';
import { type ChatUser } from './types';

type CP = {
  connected: boolean,
  viewer: ChatUser,
};

type Props = {
  children(CP): React.Node,
};

type State = {};

class Renderer extends React.Component<Props & CP, State> {
  render() {
    return this.props.connected ? this.props.children(this.props) : null;
  }
}

const mapState = (state, props) => ({
  connected: select.connected(state),
  viewer: select.viewer(state),
  channels: select.channels(state),
});

export const ConnectionGate = connect(mapState)(Renderer);
