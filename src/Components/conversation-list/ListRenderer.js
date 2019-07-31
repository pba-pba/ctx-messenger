// @flow

import * as React from 'react';
import { View, Text, Touchable, StyleSheet, Platform } from 'react-primitives';
import format from 'date-fns/format';
import is_today from 'date-fns/is_today';
import is_yesterday from 'date-fns/is_yesterday';

import { Avatar } from '../Avatar';
import { MessengerContext } from '../../MessengerContext';

import type { ChatUser, ChatConversationSlim } from '../../types';

type Props = {|
  activeConversationId: void | string,
  conversations: ChatConversationSlim[],
  onRequestConversationDetail(string): mixed,
  onUserPress(user: ChatUser): mixed,
  users: ChatUser[],
  viewer: ChatUser,
|};

export function formatDay(time: string) {
  if (is_yesterday(time)) {
    return 'Yesterday';
  }

  return format(time, 'MM/DD/YYYY');
}

export class ListRenderer extends React.Component<Props> {
  get conversations() {
    return this.props.conversations.filter(conversation => conversation.users.length >= 2);
  }

  get users() {
    return this.props.users;
  }

  message = (item: ChatConversationSlim) => {
    if (!item.last_message) {
      return null;
    }

    switch (item.last_message.message_type) {
      case 'text':
        return item.last_message.body || 'Attached Files';
      case 'call_start':
        if (item.last_message.user.id === this.props.viewer.id) {
          return 'You called';
        }
        return 'Called you';
      case 'call_end':
        return 'Call ended';
      default:
        return null;
    }
  };

  renderItem = (item: ChatConversationSlim, index: number) => {
    const users = item.users.filter(user => user.id !== this.props.viewer.id);
    const names = users.length > 1 ? users.map(user => user.first_name).join(', ') : users[0].name;
    const message = this.message(item);

    return (
      <MessengerContext.Consumer key={item.id}>
        {context => (
          <Touchable
            onPress={() => this.props.onRequestConversationDetail(item.id)}
            testID={`conversation-${index}`}
          >
            <View
              style={item.id === this.props.activeConversationId ? styles.rowActive : styles.row}
            >
              <View style={styles.avatar}>
                <Avatar
                  users={users}
                  size={40}
                  borderColor={item.read ? undefined : context.colors.brand}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.names, item.read ? undefined : styles.unreadNames]}>
                  {names}
                </Text>
                {message ? (
                  <Text
                    style={[styles.lastMessage, item.read ? undefined : styles.unreadLastMessage]}
                    numberOfLines={1}
                  >
                    {message}
                  </Text>
                ) : null}
              </View>
              {item.last_message ? (
                <View>
                  {is_today(item.last_message.timestamp) ? null : (
                    <Text style={styles.time}>{formatDay(item.last_message.timestamp)}</Text>
                  )}
                  <Text style={styles.time}>{format(item.last_message.timestamp, 'h:mm A')}</Text>
                </View>
              ) : null}
              <View
                style={[
                  styles.dot,
                  item.read ? styles.readDot : { backgroundColor: context.colors.brand },
                ]}
              />
            </View>
          </Touchable>
        )}
      </MessengerContext.Consumer>
    );
  };

  renderUser = (user: ChatUser) => {
    return (
      <Touchable key={user.id} onPress={() => this.props.onUserPress(user)}>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Avatar users={[user]} size={40} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.names}>{user.name}</Text>
          </View>
          <View>
            <Text style={styles.time}>No History</Text>
          </View>
        </View>
      </Touchable>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.conversations.length ? (
          <React.Fragment>
            <Text style={styles.text}>DIRECT AND GROUP MESSAGES</Text>

            <View style={styles.shadowByPlatform}>{this.conversations.map(this.renderItem)}</View>
          </React.Fragment>
        ) : null}

        {this.users.length ? (
          <View style={styles.shadowByPlatform}>{this.users.map(this.renderUser)}</View>
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
  unreadNames: {
    fontWeight: '600',
    color: '#232628',
  },
  lastMessage: {
    fontSize: 14,
    color: '#90A4AE',
    marginTop: 3,
  },
  unreadLastMessage: {
    fontWeight: '500',
    color: '#232628',
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
  dot: { width: 10, height: 10, borderRadius: 5, marginLeft: 10 },
  readDot: { backgroundColor: '#B0BEC5', opacity: 0.2 },
});
