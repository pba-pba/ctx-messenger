// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import { Platform, Touchable, View } from 'react-primitives';

import { select, actions } from '../../store';
import { dispatchSocketMessage } from '../../ConnectionManager/Connection';
import { createSubToConversation, cancelSubToConversation } from '../../ConnectionManager/messages';
import { MessengerContext } from '../../MessengerContext';

type Props = {
  activeConversationId: string,
  conversation: *,
  viewer: *,
  onPress(): mixed,
  subscribeToUpdates(): mixed,
  unsubscribeFromUpdates(): mixed,
};

type State = {
  loading: boolean,
};

class Renderer extends React.Component<Props, State> {
  state = {
    loading: false,
  };

  onPress = async () => {
    this.setState({ loading: true });
    await this.props.onPress(data => {
      this.props.sendMessage({
        message_type: 'call_start',
        ...data,
      });
    }, this.props.conversation.users);
    this.setState({ loading: false });
  };

  render() {
    return this.props.conversation && this.props.viewer ? (
      <MessengerContext.Consumer>
        {context => {
          const { CallIcon } = context.icons;
          const { Loader } = context.components;
          return (
            <Touchable onPress={this.onPress}>
              <View style={styles.touchableItem}>
                {this.state.loading ? <Loader /> : <CallIcon />}
              </View>
            </Touchable>
          );
        }}
      </MessengerContext.Consumer>
    ) : null;
  }
}

const mapState = (state, props) => ({
  conversation: select.conversationSlim(state, {
    conversation_id: props.activeConversationId,
  }),
  viewer: select.viewer(state),
});

const mapDispatch = (dispatch: Dispatch<*>, props) => ({
  subscribeToUpdates: () =>
    dispatchSocketMessage(createSubToConversation(props.activeConversationId)),
  unsubscribeFromUpdates: () =>
    dispatchSocketMessage(cancelSubToConversation(props.activeConversationId)),
  sendMessage: (data: *) => dispatch(actions.sendMessage(data)),
});

export const ConversationCallButton = connect(
  mapState,
  mapDispatch,
)(Renderer);

const styles = {
  touchableItem: {},
};
