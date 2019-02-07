// @flow

import * as React from 'react';
import { Platform } from 'react-primitives';
import { Provider } from 'react-redux';
import { store } from './store';
import { MessengerContext } from './MessengerContext';
import { ConnectionManager } from './ConnectionManager/ConnectionManager';
import { ConnectionGate } from './ConnectionGate';
import { dispatchSocketMessage, onMessage } from './ConnectionManager/Connection';
import { EventBinder } from './EventBinder';
import {
  createSubToSubscriptionsChannel,
  cancelSubToSubscriptionsChannel,
  createSubToUsersChannel,
  cancelSubToUsersChannel,
  createSubToAppearanceStatus,
  cancelSubToAppearanceStatus,
} from './ConnectionManager/messages';
import { clear, loading } from './store/actions';
import type { SocketAction, ChatMessage } from './types';

type Props = {
  accessToken: string,
  children: React.Node,
  socketUrl: string,
  appConfig: string,
  closeOnUnmount: boolean,
  onConnected?: () => mixed,
  onConversationsCreated?: (ids: string[]) => mixed,
  onConversationsFound?: (ids: string[]) => mixed,
  onMessageCreated?: (messages: ChatMessage[]) => mixed,
  colors: {
    brand: *,
    grayText: *,
    blackText: *,
  },
  components: {
    Input: *,
    Loader: *,
    MessagesScrollView: *,
    MessagesEndList: *,
    ListNoContent: *,
    Files: *,
  },
};

type State = {};

export class MessengerCore extends React.Component<Props, State> {
  connectionManager: ConnectionManager;

  constructor(props: Props) {
    super(props);

    this.connect();
  }

  connect = () => {
    const config = this.props.appConfig || 'default';

    this.connectionManager = new ConnectionManager({
      socketUrl: `${this.props.socketUrl}?token=${this.props.accessToken}&app_config=${config}`,
      dispatch: this.dispatch,
      reconnect: this.reconnect,
      onSocketClose: this.props.onSocketClose,
      onSocketError: this.props.onSocketError,
    });
  };

  reconnect = () => {
    this.connect();

    this.connectionManager.connection.ws.onopen = () => {
      const { ws } = this.connectionManager.connection;

      switch (ws.readyState) {
        case ws.OPEN:
          this.subscribeToChannels(store.getState());
          break;
        default:
      }
    };
  };

  disconnect = () => {
    dispatchSocketMessage(cancelSubToAppearanceStatus());
    this.dispatch(clear());
    this.connectionManager.close();
  };

  componentDidMount() {
    onMessage(message => {
      const m = message.message;
      if (!m) {
        return;
      }

      switch (m.type) {
        case 'merge_conversations':
          if (m.result.new_conversation_ids.length && this.props.onConversationsCreated) {
            this.props.onConversationsCreated(m.result.new_conversation_ids);
          }
          break;
        case 'search_conversations':
          if (this.props.onConversationsFound) {
            this.props.onConversationsFound(m.result.conversations);
          }
          break;
        case 'unshift_messages':
          if (m.result.messages.length && this.props.onMessageCreated) {
            this.props.onMessageCreated(m.result.messages);
          }
          break;
        default:
      }
    });
  }

  dispatch = (action: SocketAction) => {
    store.dispatch(action);
  };

  subscribeToChannels = state => {
    if (!state.channels.SubscriptionsChannel) {
      this.dispatch(loading({ conversations: true }));
      dispatchSocketMessage(createSubToSubscriptionsChannel());
    }

    if (!state.channels.AppearancesChannel) {
      dispatchSocketMessage(createSubToUsersChannel());
    }

    if (!state.channels.UsersChannel) {
      dispatchSocketMessage(createSubToAppearanceStatus());
    }
  };

  render() {
    const { children, accessToken, socketUrl, ...contextValue } = this.props;
    return (
      <Provider store={store}>
        <MessengerContext.Provider value={contextValue}>
          <ConnectionGate>
            {state => (
              <React.Fragment>
                <EventBinder
                  didMount={() => {
                    if (this.props.onConnected) {
                      this.props.onConnected();
                    }

                    this.subscribeToChannels(state);
                  }}
                  willUnmount={() => {
                    // if (Platform.OS === 'web') {
                    //   dispatchSocketMessage(
                    //     cancelSubToSubscriptionsChannel(),
                    //     cancelSubToUsersChannel(),
                    //   );
                    // }

                    onMessage(() => {});

                    if (this.props.closeOnUnmount) {
                      dispatchSocketMessage(cancelSubToAppearanceStatus());
                      this.dispatch(clear());
                      this.connectionManager.close();
                    }
                  }}
                />
                {this.props.children}
              </React.Fragment>
            )}
          </ConnectionGate>
        </MessengerContext.Provider>
      </Provider>
    );
  }
}
