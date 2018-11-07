// @flow

import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { MessengerContext } from './MessengerContext';
import { Subscriber } from './Subscriber';
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
} from './ConnectionManager/messages';

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
  }

  componentWillMount() {
    dispatchSocketMessage(cancelSubToSubscriptionsChannel());
    dispatchSocketMessage(cancelSubToUsersChannel());
  }

  render() {
    return null;
  }
}

export class MessengerCore extends React.Component<Props, State> {
  componentDidMount() {
    onMessage(message => {
      const m = message.message;
      if (m) {
        if (
          m.type === 'merge_conversations' &&
          m.result.new_conversation_ids.length &&
          this.props.onConversationsCreated
        ) {
          this.props.onConversationsCreated(m.result.new_conversation_ids);
        }
      }
    });
  }

  componentWillUnmount() {
    onMessage(() => {});
  }

  render() {
    const { children, accessToken, socketUrl, ...contextValue } = this.props;
    const { Loader } = this.props.components;

    const socketUrlWithToken = `${socketUrl}?token=${accessToken}`;
    return (
      <MessengerContext.Provider
        value={{ ...contextValue, socketUrl: socketUrlWithToken }}
      >
        <Provider store={store}>
          <Subscriber>
            <ConnectionGate Loader={Loader}>
              {() => (
                <React.Fragment>
                  <EventBinder />
                  {this.props.children}
                </React.Fragment>
              )}
            </ConnectionGate>
          </Subscriber>
        </Provider>
      </MessengerContext.Provider>
    );
  }
}
