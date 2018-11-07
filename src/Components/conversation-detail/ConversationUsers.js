// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-primitives';

import { select } from '../../store';
import { MessengerContext } from '../../MessengerContext';
import { Avatar } from '../Avatar';

type Props = {
  activeConversationId: *,
  conversation: *,
  viewer: *,
};

type State = {};

class Renderer extends React.Component<Props, State> {
  renderUsers = (users: *) => {
    users = users.filter(user => user.id !== this.props.viewer.id);
    const userNames =
      users.length > 1
        ? users.map(user => user.first_name).join(', ')
        : users[0].name;

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <Avatar users={users} size={28} />
        <Text
          style={{
            color: '#455A64',
            fontSize: 15,
            fontWeight: '500',
            lineHeight: 18,
            marginLeft: 10,
          }}
        >
          {userNames}
        </Text>
      </View>
    );
  };

  render() {
    if (this.props.activeConversationId === undefined) {
      return null;
    }

    return (
      <MessengerContext.Consumer>
        {context => {
          const { Loader } = context.components;
          return this.props.conversation && this.props.viewer ? (
            this.renderUsers(this.props.conversation.users)
          ) : (
            <Loader />
          );
        }}
      </MessengerContext.Consumer>
    );
  }
}

const mapState = (state, props) => ({
  conversation: select.conversationSlim(state, {
    conversation_id: props.activeConversationId,
  }),
  viewer: select.viewer(state),
});

export const ConversationUsers = connect(mapState, {})(Renderer);
