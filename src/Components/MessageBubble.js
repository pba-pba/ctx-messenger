// @flow

import * as React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-primitives';
import format from 'date-fns/format';
import is_today from 'date-fns/is_today';
import { MessengerContext } from '../MessengerContext';
import { Avatar } from './Avatar';
import type { ChatMessage, ChatUser } from '../types';
import { MessageAttachments } from './MessageAttachments';
import { formatDay } from './conversation-list/ListRenderer';
import { DraftJsRenderer } from './draft-js/DraftJsRenderer';

type Props = {
  message: ChatMessage,
  viewer: ChatUser,
};

type State = {};

export class MessageBubble extends React.Component<Props, State> {
  renderUserRow = style => {
    return (
      <MessengerContext.Consumer>
        {context => (
          <View style={[styles.userRow, style]}>
            <View style={{ flexDirection: 'row' }}>
              {is_today(this.props.message.timestamp) ? null : (
                <Text style={[styles.time, { marginRight: 3 }]}>
                  {formatDay(this.props.message.timestamp)}
                </Text>
              )}
              <Text style={styles.time}>{format(this.props.message.timestamp, 'h:mm A')}</Text>
            </View>

            <Text style={[styles.name, { color: context.colors.blackText }]} numberOfLines={1}>
              {this.props.message.user.name}
            </Text>

            <Avatar users={[this.props.message.user]} size={24} />
          </View>
        )}
      </MessengerContext.Consumer>
    );
  };

  renderMessage = () => {
    return (
      <MessengerContext.Consumer>
        {context => {
          const textStyle = { color: context.colors.blackText, ...styles.messageText };
          return this.props.message.rich_body ? (
            <View
              style={[
                styles.richContent,
                Platform.OS === 'web' ? { wordBreak: 'break-word' } : undefined,
              ]}
            >
              <DraftJsRenderer
                richContent={this.props.message.rich_body}
                color={context.colors.blackText}
              />
            </View>
          ) : Platform.OS === 'web' ? (
            <div style={{ wordBreak: 'break-word', ...textStyle }}>{this.props.message.body}</div>
          ) : (
            <Text style={textStyle}>{this.props.message.body}</Text>
          );
        }}
      </MessengerContext.Consumer>
    );
  };

  renderPushedRight(context) {
    return (
      <React.Fragment>
        {this.renderUserRow()}
        <View style={[styles.column, { alignItems: 'flex-end', marginLeft: 'auto' }]}>
          {this.renderMessage()}
          <MessageAttachments context={context} attachments={this.props.message.attachments} />
        </View>
      </React.Fragment>
    );
  }

  renderPushedLeft(context) {
    return (
      <React.Fragment>
        {this.renderUserRow(styles.reverseRow)}
        <View style={[styles.column, { alignItems: 'flex-start', marginRight: 'auto' }]}>
          {this.renderMessage()}
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
  userRow: {
    alignItems: 'center',
    maxWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  column: {
    width: '100%',
    maxWidth: '90%',
    marginVertical: 5,
  },
  reverseRow: {
    flexDirection: 'row-reverse',
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
  richContent: { alignItems: 'flex-start' },
});
