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

  renderPreviousButton() {
    return this.props.conversation.endReached ? null : (
      <Touchable onPress={this.props.onRequestPreviousMessages}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#ccc' }}>Load Previous Messages</Text>
        </View>
      </Touchable>
    );
  }

  render() {
    const { conversation, viewer } = this.props;
    return (
      <MessengerContext.Consumer>
        {context => {
          const { MessagesScrollView } = context.components;
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
            >
              <View style={styles.container}>
                {conversation && viewer ? (
                  <React.Fragment>{conversation.messages.map(this.renderMessage)}</React.Fragment>
                ) : null}
                {this.renderPreviousButton()}
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
