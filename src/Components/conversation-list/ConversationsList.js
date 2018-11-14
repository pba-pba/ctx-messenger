// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';

import { select } from '../../store';
import { ListRenderer } from './ListRenderer';
import { MessengerContext } from '../../MessengerContext';
import { dispatchSocketMessage } from '../../ConnectionManager/Connection';
import { readChatMessages } from '../../ConnectionManager/messages';

type Props = {|
  activeConversationId: *,
  conversations: *,
  onRequestConversationDetail: *,
  viewer: *,
|};

class Renderer extends React.Component<Props> {

  componentDidUpdate = () => {
    const conversations = this.props.conversations || [];
    const activeConversationDetail = conversations.find(conv => conv.id === this.props.activeConversationId);

    if (activeConversationDetail && !activeConversationDetail.read) {
      this.props.readMessages();
    }
  }

  render() {
    return (
      <MessengerContext.Consumer>
        {context => {
          const { Loader } = context.components;
          return this.props.conversations && this.props.viewer ? (
            <ListRenderer
              activeConversationId={this.props.activeConversationId}
              conversations={this.props.conversations}
              onRequestConversationDetail={this.props.onRequestConversationDetail}
              viewer={this.props.viewer}
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
  conversations: select.conversations(state),
  viewer: select.viewer(state),
});

const mapDispatch = (dispatch: Dispatch<*>, props) => ({
  readMessages: () => dispatchSocketMessage(readChatMessages(props.activeConversationId)),
});

export const ConversationsList = connect(mapState, mapDispatch)(Renderer);
