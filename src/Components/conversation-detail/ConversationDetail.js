// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import { Platform } from 'react-primitives';

import { select } from '../../store';
import { MessengerContext } from '../../MessengerContext';
import { dispatchSocketMessage } from '../../ConnectionManager/Connection';
import {
  createSubToConversation,
  cancelSubToConversation,
  requestMessagesBatch,
} from '../../ConnectionManager/messages';
import { loading } from '../../store/actions';
import { MessageList } from './MessageList';
import type { MessageBatchRequest } from '../../types';

type Props = {
  activeConversationId: *,
  loadingMessages: boolean,
  onMessagePress(message: *): mixed,
};

type CP = {
  conversationDetail: *,
  viewer: *,
  subscribeToUpdates(): mixed,
  unsubscribeFromUpdates(): mixed,
  requestMessages(MessageBatchRequest): mixed,
};

type State = {};

class Renderer extends React.Component<Props & CP, State> {
  componentDidMount() {
    this.props.subscribeToUpdates();
  }

  componentDidUpdate(prevProps: Props) {
    if (Platform.OS === 'web') {
      return;
    }

    if (prevProps.activeConversationId !== this.props.activeConversationId) {
      this.props.subscribeToUpdates();
    }
  }

  // ak niekto zmaze tuto cas, ruky a nohy dolamem!!
  componentWillReceiveProps(nextProps: Props) {
    if (Platform.OS === 'web') {
      return;
    }

    if (
      nextProps.activeConversationId !== this.props.activeConversationId &&
      this.props.connected
    ) {
      this.props.unsubscribeFromUpdates();
    }
  }

  componentWillUnmount() {
    if (this.props.connected) {
      this.props.unsubscribeFromUpdates();
    }
  }

  onRequestPreviousMessages = () => {
    if (this.props.loadingMessages) {
      return;
    }
    const detail = this.props.conversationDetail;
    this.props.requestMessages({
      conversation_id: detail.conversation_id,
      cursor: detail.messages[detail.messages.length - 1].id,
      limit: detail.limit,
    });
  };

  render() {
    if (this.props.activeConversationId === undefined) {
      return null;
    }

    return (
      <MessengerContext.Consumer>
        {context => {
          const { Loader } = context.components;
          return this.props.conversationDetail && this.props.viewer ? (
            <MessageList
              conversation={this.props.conversationDetail}
              viewer={this.props.viewer}
              onRequestPreviousMessages={this.onRequestPreviousMessages}
              onMessagePress={this.props.onMessagePress}
              busy={this.props.loadingMessages}
            />
          ) : (
            <Loader />
          );
        }}
      </MessengerContext.Consumer>
    );
  }
}

const mapState = (state, props) => ({
  loadingMessages: select.loading(state, 'get_messages'),
  conversationDetail: select.conversationDetail(state, {
    conversation_id: props.activeConversationId,
  }),
  viewer: select.viewer(state),
  connected: select.connected(state),
});

const mapDispatch = (dispatch: Dispatch<*>, props) => ({
  subscribeToUpdates: () =>
    props.activeConversationId
      ? dispatchSocketMessage(createSubToConversation(props.activeConversationId))
      : null,
  unsubscribeFromUpdates: () =>
    props.activeConversationId
      ? dispatchSocketMessage(cancelSubToConversation(props.activeConversationId))
      : null,
  requestMessages: request => {
    dispatch(loading({ get_messages: true }));
    dispatchSocketMessage(requestMessagesBatch(request));
  },
});

export const ConversationDetail = connect(
  mapState,
  mapDispatch,
)(Renderer);
