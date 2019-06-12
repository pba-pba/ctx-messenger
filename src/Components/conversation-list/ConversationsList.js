// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';

import { select } from '../../store';
import { ListRenderer } from './ListRenderer';
import { MessengerContext } from '../../MessengerContext';
import { dispatchSocketMessage } from '../../ConnectionManager/Connection';
import { readChatMessages } from '../../ConnectionManager/messages';
import { searchConversationsByUsers, setDraft } from '../../store/actions';

type Props = {|
  activeConversationId?: *,
  conversations: *,
  loadingConversations: *,
  onRequestConversationDetail: *,
  viewer: *,
|};

class Renderer extends React.Component<Props> {
  get conversations() {
    if (!this.props.conversations) {
      return [];
    }
    return this.props.conversations.filter(conversation => !!conversation.last_message);
  }

  get users() {
    return this.props.users || [];
  }

  componentDidUpdate = () => {
    const activeConversationDetail = this.props.conversations.find(
      conv => conv.id === this.props.activeConversationId,
    );

    if (activeConversationDetail && !activeConversationDetail.read) {
      this.props.readMessages();
    }
  };

  render() {
    return (
      <MessengerContext.Consumer>
        {context => {
          const { Loader, ListNoContent, ListSearchNoContent } = context.components;

          return this.props.viewer ? (
            this.conversations.length || this.users.length ? (
              <ListRenderer
                activeConversationId={this.props.activeConversationId}
                conversations={this.conversations}
                onRequestConversationDetail={this.props.onRequestConversationDetail}
                viewer={this.props.viewer}
                users={this.users}
                onUserPress={user =>
                  this.props.onUserPress(user, {
                    setDraft: this.props.setDraft,
                    draft: this.props.draft,
                    viewer: this.props.viewer,
                  })
                }
              />
            ) : this.props.loadingConversations ? (
              <Loader />
            ) : this.props.searchConversationQuery ? (
              <ListSearchNoContent />
            ) : (
              <ListNoContent />
            )
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
  draft: select.draft(state),
  loadingConversations: select.loading(state, 'conversations'),
  searchConversationQuery: select.searchConversationQuery(state),
  users: select.users(state),
  viewer: select.viewer(state),
});

const mapDispatch = (dispatch: Dispatch<*>, props) => ({
  readMessages: () => dispatchSocketMessage(readChatMessages(props.activeConversationId)),
  setDraft: draft => {
    if (draft) {
      dispatch(searchConversationsByUsers(draft.users));
    }
    dispatch(setDraft(draft));
  },
});

export const ConversationsList = connect(
  mapState,
  mapDispatch,
)(Renderer);
