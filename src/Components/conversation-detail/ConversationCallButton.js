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

class Renderer extends React.Component<Props> {
  componentDidMount() {
    this.props.subscribeToUpdates();
  }

  componentDidUpdate(prevProps) {
    if (Platform.OS === 'web') {
      return;
    }

    if (prevProps.activeConversationId !== this.props.activeConversationId) {
      this.props.subscribeToUpdates();
    }
  }

  componentWillUnmount() {
    this.props.unsubscribeFromUpdates();
  }

  onPress = () => {
    this.props.onPress(this.props.sendMessage, this.props.conversation.users)
  }

  render() {
    return this.props.conversation && this.props.viewer ? (
      <MessengerContext.Consumer>
        {context => {
          const { CallIcon } = context.icons
          return (
            <Touchable onPress={this.onPress} >
              <View style={styles.touchableItem}>
                <CallIcon />
              </View>
            </Touchable>
          )
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
  sendMessage: (data:*) => dispatch(actions.sendMessage(data)),
});

export const ConversationCallButton = connect(mapState, mapDispatch)(Renderer);

const styles = {
  touchableItem: {
    margin: 10,
  },
};
