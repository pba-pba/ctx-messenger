// @flow

import * as React from 'react';
import { View, Platform } from 'react-primitives';
import { MessengerContext } from '../../MessengerContext';
import { MessageBubble } from '../MessageBubble';
import { MessageCall } from '../MessageCall';
import type { ChatMessage, ChatUser, ConversationState } from '../../types';

type Props = {
  busy: boolean,
  conversation: ConversationState,
  onMessagePress(message: ChatMessage): mixed,
  onRequestPreviousMessages: *,
  viewer: ChatUser,
};

type State = {};

export class MessageList extends React.Component<Props, State> {
  renderTextMessage = (message: ChatMessage) => {
    return (
      <View style={styles.bubbleContainer} key={message.id}>
        <MessageBubble
          message={message}
          viewer={this.props.viewer}
          onPress={this.props.onMessagePress}
        />
      </View>
    );
  };

  renderCallMessage = (message: ChatMessage) => {
    return (
      <View style={styles.bubbleContainer} key={message.id}>
        <MessageCall message={message} onPress={this.props.onMessagePress} />
      </View>
    );
  };

  renderMessage = (message: ChatMessage) => {
    switch (message.message_type) {
      case 'call_start':
      case 'call_end':
        return this.renderCallMessage(message);
      default:
        return this.renderTextMessage(message);
    }
  };

  onScroll = e => {
    if (this.props.conversation.endReached) {
      return;
    }

    if (e.scrollTop === 0) {
      this.props.onRequestPreviousMessages();
    }
  };

  render() {
    const { conversation, viewer } = this.props;
    return (
      <MessengerContext.Consumer>
        {context => {
          const { MessagesScrollView, Loader, MessagesEndList } = context.components;
          return (
            <MessagesScrollView
              style={Platform.OS === 'web' ? styles.scrollViewWeb : undefined}
              onScroll={this.onScroll}
            >
              <View
                style={[
                  styles.container,
                  Platform.OS === 'web' ? { minHeight: '100%' } : undefined,
                ]}
              >
                {conversation && viewer ? (
                  <React.Fragment>{conversation.messages.map(this.renderMessage)}</React.Fragment>
                ) : null}
                {this.props.busy ? (
                  <Loader />
                ) : this.props.conversation.endReached ? (
                  <MessagesEndList />
                ) : null}
              </View>
            </MessagesScrollView>
          );
        }}
      </MessengerContext.Consumer>
    );
  }
}

const styles = {
  container: {
    flexDirection: 'column-reverse',
    justifyContent: 'flex-start',
  },
  bubbleContainer: {
    padding: 10,
  },
  scrollViewWeb: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
};
