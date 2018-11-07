// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { select } from './store/select';
import { type ChatUser } from './types';

type CP = {
  connected: boolean,
  viewer: ChatUser,
  Loader: *,
};

type Props = {
  children(CP): React.Node,
};

type State = {};

class Renderer extends React.Component<Props & CP, State> {
  getRenderProps = () => ({
    connected: this.props.connected,
    viewer: this.props.viewer,
  });

  render() {
    const { Loader } = this.props;
    return this.props.connected ? (
      this.props.children(this.getRenderProps())
    ) : (
      <Loader />
    );
  }
}

const mapState = (state, props) => ({
  connected: select.connected(state),
  viewer: select.viewer(state),
});

export const ConnectionGate = connect(mapState)(Renderer);
