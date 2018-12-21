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
import { MessageList } from './MessageList';
import type { MessageBatchRequest } from '../../types';

type Props = {
  activeConversationId: *,
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

  onRequestPreviousMessages = () => {
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
  conversationDetail: select.conversationDetail(state, {
    conversation_id: props.activeConversationId,
  }),
  viewer: select.viewer(state),
});

const mapDispatch = (dispatch: Dispatch<*>, props) => ({
  subscribeToUpdates: () =>
    dispatchSocketMessage(createSubToConversation(props.activeConversationId)),
  unsubscribeFromUpdates: () =>
    dispatchSocketMessage(cancelSubToConversation(props.activeConversationId)),
  requestMessages: request => dispatchSocketMessage(requestMessagesBatch(request)),
});

export const ConversationDetail = connect(
  mapState,
  mapDispatch,
)(Renderer);
