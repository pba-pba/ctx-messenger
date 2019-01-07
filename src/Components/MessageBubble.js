// @flow

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-primitives';
import format from 'date-fns/format';
import is_today from 'date-fns/is_today';
import { MessengerContext } from '../MessengerContext';
import { Avatar } from './Avatar';
import type { ChatMessage, ChatUser } from '../types';
import { MessageAttachments } from './MessageAttachments';
import { formatDay } from './conversation-list/ListRenderer';

type Props = {
  message: ChatMessage,
  viewer: ChatUser,
};

type State = {};

export class MessageBubble extends React.Component<Props, State> {
  renderUserRow = () => {
    return (
      <MessengerContext.Consumer>
        {context => (
          <React.Fragment>
            <View style={{ flexDirection: 'row' }}>
              {is_today(this.props.message.timestamp) ? null : (
                <Text style={[styles.time, { marginRight: 3 }]}>
                  {formatDay(this.props.message.timestamp)}
                </Text>
              )}
              <Text style={styles.time}>{format(this.props.message.timestamp, 'h:mm A')}</Text>
            </View>

            <Text style={[styles.name, { color: context.colors.blackText }]}>
              {this.props.message.user.name}
            </Text>

            <Avatar users={[this.props.message.user]} size={24} />
          </React.Fragment>
        )}
      </MessengerContext.Consumer>
    );
  };

  renderMessage = () => {
    return (
      <MessengerContext.Consumer>
        {context => (
          <Text style={[{ color: context.colors.blackText }, styles.messageText]}>
            {this.props.message.body}
          </Text>
        )}
      </MessengerContext.Consumer>
    );
  };

  renderPushedRight(context) {
    return (
      <React.Fragment>
        <View style={[styles.row]}>{this.renderUserRow()}</View>
        <View style={[styles.column, { marginRight: 24 }]}>
          <View>{this.renderMessage()}</View>
          <MessageAttachments context={context} attachments={this.props.message.attachments} />
        </View>
      </React.Fragment>
    );
  }

  renderPushedLeft(context) {
    return (
      <React.Fragment>
        <View style={[styles.row, styles.reverseRow]}>{this.renderUserRow()}</View>
        <View style={[styles.column, { marginLeft: 24, alignItems: 'flex-start' }]}>
          <View>{this.renderMessage()}</View>
          <MessageAttachments context={context} attachments={this.props.message.attachments} />
        </View>
      </React.Fragment>
    );
  }

  render() {
    if (this.props.message.message_type !== 'text') {
      return null;
    }

    const isMe = this.props.viewer.id === this.props.message.user.id;

    return (
      <MessengerContext.Consumer>
        {context => (
          <View>{isMe ? this.renderPushedRight(context) : this.renderPushedLeft(context)}</View>
        )}
      </MessengerContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    maxWidth: '80%',
    width: '100%',
  },
  column: {
    alignItems: 'flex-end',
    marginLeft: 'auto',
    width: '100%',
    maxWidth: '80%',
    marginVertical: 5,
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
  time: {
    color: '#90A4AE',
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'right',
  },
});
