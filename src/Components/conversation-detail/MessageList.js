// @flow

import * as React from 'react';
import { View, Text, Touchable, StyleSheet } from 'react-primitives';
import { MessengerContext } from '../../MessengerContext';
import { MessageBubble } from '../MessageBubble';
import type { ChatMessage, ChatUser, ConversationState } from '../../types';

type Props = {
  conversation: ConversationState,
  viewer: ChatUser,
  onRequestPreviousMessages: *,
};

type State = {};

export class MessageList extends React.Component<Props, State> {
  renderMessage = (message: ChatMessage) => {
    return (
      <View style={styles.bubbleContainer} key={message.id}>
        <MessageBubble message={message} viewer={this.props.viewer} />
      </View>
    );
  };

  onScroll = (e) => {
    if (e.scrollTop === 0) {
      this.props.onRequestPreviousMessages();
    }
  }

  render() {
    const { conversation, viewer } = this.props;
    return (
      <MessengerContext.Consumer>
        {context => {
          const { MessagesScrollView, Loader } = context.components;
          return (
            <MessagesScrollView
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
              }}
              onScroll={this.onScroll}
            >
              <View style={styles.container}>
                {conversation && viewer ? (
                  <React.Fragment>{conversation.messages.map(this.renderMessage)}</React.Fragment>
                ) : null}
                {this.props.conversation.endReached ? null : <Loader />}
              </View>
            </MessagesScrollView>
          );
        }}
      </MessengerContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column-reverse',
    justifyContent: 'flex-start',
    minHeight: '100%',
  },
  bubbleContainer: {
    padding: 10,
  },
});
