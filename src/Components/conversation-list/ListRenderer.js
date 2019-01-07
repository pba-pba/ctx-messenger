// @flow

import * as React from 'react';
import { View, Text, Touchable, StyleSheet, Platform } from 'react-primitives';
import { Avatar } from '../Avatar';
import type { ChatUser, ChatConversationSlim } from '../../types';
import format from 'date-fns/format';
import is_today from 'date-fns/is_today';
import is_yesterday from 'date-fns/is_yesterday';

type Props = {|
  activeConversationId: void | string,
  conversations: ChatConversationSlim[],
  onRequestConversationDetail(string): mixed,
  viewer: ChatUser,
|};

export function formatDay(time: string) {
  if (is_yesterday(time)) {
    return 'Yesterday';
  }

  return format(time, 'DD.MM.YYYY');
}

export class ListRenderer extends React.Component<Props> {
  get groups() {
    return this.props.conversations.filter(conversation => conversation.users.length > 2);
  }

  get direct() {
    return this.props.conversations.filter(conversation => conversation.users.length === 2);
  }

  message = (item: *) => {
    if (!item.last_message) {
      return null;
    }

    switch (item.last_message.message_type) {
      case 'text':
        return item.last_message.body || 'Attached Files';
      case 'call_start':
        return 'Called you';
      case 'call_end':
        return 'Call ended';
      default:
        return null;
    }
  };

  renderItem = (item: *) => {
    const users = item.users.filter(user => user.id !== this.props.viewer.id);
    const names = users.length > 1 ? users.map(user => user.first_name).join(', ') : users[0].name;
    const message = this.message(item);

    return (
      <Touchable key={item.id} onPress={() => this.props.onRequestConversationDetail(item.id)}>
        <View style={item.id === this.props.activeConversationId ? styles.rowActive : styles.row}>
          <View style={styles.avatar}>
            <Avatar users={users} size={40} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.names}>{names}</Text>
            {message ? (
              <Text
                style={[styles.lastMessage, !item.read ? styles.unreadLastMessage : undefined]}
                numberOfLines={1}
              >
                {message}
              </Text>
            ) : null}
          </View>
          <View>
            {is_today(item.last_message.timestamp) ? null : (
              <Text style={styles.time}>{formatDay(item.last_message.timestamp)}</Text>
            )}
            <Text style={styles.time}>{format(item.last_message.timestamp, 'h:mm A')}</Text>
          </View>
        </View>
      </Touchable>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.direct.length ? (
          <React.Fragment>
            <Text style={styles.text}>DIRECT MESSAGES</Text>
            <View style={styles.shadowByPlatform}>{this.direct.map(this.renderItem)}</View>
          </React.Fragment>
        ) : null}
        {this.groups.length ? (
          <React.Fragment>
            <Text style={styles.text}>GROUP MESSAGES</Text>
            <View style={styles.shadowByPlatform}>{this.groups.map(this.renderItem)}</View>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowActive: {
    padding: 10,
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  names: {
    fontSize: 15,
    fontWeight: '500',
    color: '#455A64',
  },
  lastMessage: {
    fontSize: 14,
    color: '#90A4AE',
  },
  unreadLastMessage: {
    fontWeight: 'bold',
    color: '#455A64',
  },
  avatar: {
    marginRight: 10,
  },
  time: {
    color: '#90A4AE',
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'right',
  },
  shadowByPlatform: Platform.select({
    ios: {
      shadowColor: 'rgb(143,142,148)',
      shadowOpacity: 0.3,
      shadowRadius: 3,
      borderRadius: 3,
      shadowOffset: { width: 1, height: 4 },
    },
    android: {
      borderRadius: 3,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(143,142,148,0.3)',
    },
  }),
  text: {
    color: '#90A4AE',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 13,
    paddingHorizontal: 7,
    paddingBottom: 10,
    paddingTop: 20,
  },
});
