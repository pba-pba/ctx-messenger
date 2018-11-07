// @flow

import * as React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-primitives';
import distance_in_words_to_now from 'date-fns/distance_in_words_to_now';
import { MessengerContext } from '../MessengerContext';
import { Avatar } from './Avatar';
import type { ChatMessage, ChatUser } from '../types';

type Props = {
  message: ChatMessage,
  viewer: ChatUser,
};

type State = {};

export class MessageBubble extends React.Component<Props, State> {
  renderPushedRight(userRow, message) {
    return (
      <React.Fragment>
        <View style={[styles.row]}>{userRow}</View>
        <View style={[styles.row, { paddingRight: 34, marginVertical: 5 }]}>
          {message}
        </View>
      </React.Fragment>
    );
  }

  renderPushedLeft(userRow, message) {
    return (
      <React.Fragment>
        <View style={[styles.row, styles.reverseRow]}>{userRow}</View>
        <View
          style={[
            styles.row,
            styles.reverseRow,
            { paddingRight: 34, marginVertical: 5 },
          ]}
        >
          {message}
        </View>
      </React.Fragment>
    );
  }

  render() {
    if (this.props.message.message_type !== 'text') {
      return null;
    }

    const isMe = this.props.viewer.id === this.props.message.user.id;

    const userRow = (
      <MessengerContext.Consumer>
        {context => (
          <React.Fragment>
            <Text
              style={[styles.timestamp, { color: context.colors.grayText }]}
            >
              {distance_in_words_to_now(this.props.message.timestamp, {
                addSuffix: true,
              })}
            </Text>

            <Text style={[styles.name, { color: context.colors.blackText }]}>
              {this.props.message.user.name}
            </Text>

            <Avatar users={[this.props.message.user]} size={24} />
          </React.Fragment>
        )}
      </MessengerContext.Consumer>
    );

    const message = (
      <MessengerContext.Consumer>
        {context => (
          <View style={Platform.OS !== 'web' ? styles.border : undefined}>
            <Text
              style={[{ color: context.colors.blackText }, styles.messageText]}
            >
              {this.props.message.body}
            </Text>
          </View>
        )}
      </MessengerContext.Consumer>
    );

    return (
      <MessengerContext.Consumer>
        {context => (
          <View>
            {Platform.OS === 'web' && isMe
              ? this.renderPushedRight(userRow, message)
              : this.renderPushedLeft(userRow, message)}
          </View>
        )}
      </MessengerContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    // common
    justifyContent: 'flex-end',
    // diff
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    maxWidth: Platform.OS === 'web' ? '80%' : '100%',
  },
  reverseRow: {
    flexDirection: 'row-reverse',
    marginRight: 'auto',
    marginLeft: 0,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 10,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '500',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  border: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFF2',
    paddingBottom: 10,
  },
});
