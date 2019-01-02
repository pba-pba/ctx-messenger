// @flow

import * as React from 'react';
import { MessengerContext } from './MessengerContext';
import { store } from './store';
import { ConnectionManager } from './ConnectionManager/ConnectionManager';
import type { SocketAction, State } from './types';

type Props = {
  children: React.Node,
};

type CtxProps = {
  socketUrl: string,
};

class SubscriberInternal extends React.Component<Props & CtxProps, State> {
  connectionManager: ConnectionManager;

  constructor(props: Props & CtxProps) {
    super(props);

    this.connectionManager = new ConnectionManager({
      socketUrl: this.props.socketUrl,
      dispatch: this.dispatch,
    });
  }

  componentWillUnmount() {
    this.connectionManager.close();
  }

  dispatch = (action: SocketAction) => {
    store.dispatch(action);
  };

  render() {
    return this.props.children;
  }
}

export const Subscriber = (props: Props) => {
  return (
    <MessengerContext.Consumer>
      {context => <SubscriberInternal socketUrl={context.socketUrl} {...props} />}
    </MessengerContext.Consumer>
  );
};
