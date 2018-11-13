// @flow

import * as React from 'react';
import { View, Text, Touchable, StyleSheet } from 'react-primitives';
import { Avatar } from '../Avatar';
import type { ChatUser, ChatConversationSlim } from '../../types';

type Props = {|
  activeConversationId: void | string,
  conversations: ChatConversationSlim[],
  onRequestConversationDetail(string): mixed,
  viewer: ChatUser,
|};

export class ListRenderer extends React.Component<Props> {
  renderItem = (item: *) => {
    const isActive = item.id === this.props.activeConversationId;
    const users = item.users.filter(user => user.id !== this.props.viewer.id);
    const names = users.length > 1 ? users.map(user => user.first_name).join(', ') : users[0].name;
    const message = item.last_message
      ? item.last_message.message_type === 'text'
        ? item.last_message.body
        : null
      : null;

    return (
      <Touchable key={item.id} onPress={() => this.props.onRequestConversationDetail(item.id)}>
        <View style={isActive ? styles.rowActive : styles.row}>
          <View style={styles.avatar}>
            <Avatar users={users} size={40} />
          </View>
          <View>
            <Text style={styles.names}>{names}</Text>
            {message && <Text style={[styles.lastMessage, !item.read ? styles.unreadLastMessage : undefined]}>{message}</Text>}
          </View>
        </View>
      </Touchable>
    );
  };

  render() {
    return <React.Fragment>{this.props.conversations.map(this.renderItem)}</React.Fragment>;
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
});
