// @flow

import * as React from 'react';
import { Platform } from 'react-primitives';
import { Provider } from 'react-redux';
import { store } from './store';
import { MessengerContext } from './MessengerContext';
import { ConnectionManager } from './ConnectionManager/ConnectionManager';
import { ConnectionGate } from './ConnectionGate';
import {
  dispatchSocketMessage,
  onMessage,
} from './ConnectionManager/Connection';
import { EventBinder } from './EventBinder';
import {
  createSubToSubscriptionsChannel,
  cancelSubToSubscriptionsChannel,
  createSubToUsersChannel,
  cancelSubToUsersChannel,
  createSubToAppearanceStatus,
  cancelSubToAppearanceStatus,
} from './ConnectionManager/messages';
import type { SocketAction, ChatMessage } from './types';

type Props = {
  accessToken: string,
  children: React.Node,
  socketUrl: string,
  appConfig: string,
  onConversationsCreated?: (ids: string[]) => mixed,
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
  },
};

type State = {};

export class MessengerCore extends React.Component<Props, State> {
  connectionManager: ConnectionManager;

  constructor(props: Props) {
    super(props);

    const config = this.props.appConfig || 'default';

    this.connectionManager = new ConnectionManager({
      socketUrl: `${this.props.socketUrl}?token=${this.props.accessToken}&app_config=${config}`,
      dispatch: this.dispatch
    });
  }

  componentDidMount() {
    onMessage(message => {
      const m = message.message;
      if (m) {
        switch (m.type) {
          case 'merge_conversations':
            if (
              m.result.new_conversation_ids.length &&
              this.props.onConversationsCreated
            ) {
              this.props.onConversationsCreated(m.result.new_conversation_ids);
            }
            break
          case 'unshift_messages':
            if (m.result.messages.length && this.props.onMessageCreated) {
              this.props.onMessageCreated(m.result.messages);
            }
            break
          default:
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
                <EventBinder
                  didMount={() => {
                    dispatchSocketMessage(createSubToSubscriptionsChannel());
                    dispatchSocketMessage(createSubToUsersChannel());
                    if (Platform.OS === 'web') {
                      dispatchSocketMessage(createSubToAppearanceStatus());
                    }
                  }}
                  willUnmount={() => {
                    if (Platform.OS === 'web') {
                      dispatchSocketMessage(cancelSubToSubscriptionsChannel());
                      dispatchSocketMessage(cancelSubToUsersChannel());
                      dispatchSocketMessage(cancelSubToAppearanceStatus());
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
