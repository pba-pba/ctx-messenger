// @flow

import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { MessengerContext } from './MessengerContext';
import { ConnectionManager } from './ConnectionManager/ConnectionManager';
import { ConnectionGate } from './ConnectionGate';
import {
  dispatchSocketMessage,
  onMessage,
} from './ConnectionManager/Connection';
import {
  createSubToSubscriptionsChannel,
  cancelSubToSubscriptionsChannel,
  createSubToUsersChannel,
  cancelSubToUsersChannel,
  createSubToAppearanceStatus,
  cancelSubToAppearanceStatus,
} from './ConnectionManager/messages';
import type { SocketAction } from './types';

type Props = {
  accessToken: string,
  children: React.Node,
  socketUrl: string,
  onConversationsCreated(string[]): mixed,
  colors: {
    brand: *,
    grayText: *,
    blackText: *,
  },
  components: {
    Input: *,
    Loader: *,
    MessagesScrollView: *,
  },
};

type State = {};

class EventBinder extends React.Component<{}> {
  componentDidMount() {
    dispatchSocketMessage(createSubToSubscriptionsChannel());
    dispatchSocketMessage(createSubToUsersChannel());
    dispatchSocketMessage(createSubToAppearanceStatus());
  }

  componentWillUnmount() {
    dispatchSocketMessage(cancelSubToSubscriptionsChannel());
    dispatchSocketMessage(cancelSubToUsersChannel());
    dispatchSocketMessage(cancelSubToAppearanceStatus());
  }

  render() {
    return null;
  }
}

export class MessengerCore extends React.Component<Props, State> {
  connectionManager: ConnectionManager;

  constructor(props: Props) {
    super(props);

    this.connectionManager = new ConnectionManager({
      socketUrl: `${this.props.socketUrl}?token=${this.props.accessToken}`,
      dispatch: this.dispatch,
    });
  }

  componentDidMount() {
    onMessage(message => {
      const m = message.message;
      if (m) {
        if (
          m.type === 'merge_conversations' &&
          m.result.new_conversation_ids.length
        ) {
          this.props.onConversationsCreated(m.result.new_conversation_ids);
        }
      }
    });
  }

  componentWillUnmount() {
    onMessage(() => {});
    this.connectionManager.close();
  }

  dispatch = (action: SocketAction) => {
    store.dispatch(action);
  };

  render() {
    const { children, accessToken, socketUrl, ...contextValue } = this.props;
    return (
      <Provider store={store}>
        <MessengerContext.Provider value={contextValue}>
          <ConnectionGate>
            {() => (
              <React.Fragment>
                <EventBinder />
                {this.props.children}
              </React.Fragment>
            )}
          </ConnectionGate>
        </MessengerContext.Provider>
      </Provider>
    );
  }
}
