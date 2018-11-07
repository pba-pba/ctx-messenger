// @flow

import * as React from 'react';
import { View, Text, Touchable, StyleSheet, Platform } from 'react-primitives';
import { MessengerContext } from '../../MessengerContext';
import { MessageBubble } from '../MessageBubble';
import type { ChatMessage, ChatUser, ConversationState } from '../../types';

type Props = {
  conversation: ConversationState,
  viewer: ChatUser,
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
      <MessengerContext>
        {context => {
          const { MessagesScrollView } = context.components;
          return (
            <MessagesScrollView style={{ width: '100%', height: '100%' }}>
              <View style={{ flexDirection: 'column-reverse' }}>
                {conversation && viewer
                  ? conversation.messages.map(this.renderMessage)
                  : null}
                {this.renderPreviousButton()}
              </View>
            </MessagesScrollView>
          );
        }}
      </MessengerContext>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  bubbleContainer: {
    paddingTop: Platform.OS === 'web' ? 10 : 3,
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'web' ? 10 : 0,
  },
});
