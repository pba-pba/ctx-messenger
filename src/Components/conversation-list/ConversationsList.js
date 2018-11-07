// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import { select } from '../../store';
import { ListRenderer } from './ListRenderer';
import { MessengerContext } from '../../MessengerContext';

type Props = {|
  activeConversationId: *,
  conversations: *,
  onRequestConversationDetail: *,
  viewer: *,
  searchValue: string,
|};

class Renderer extends React.Component<Props> {
  static defaultProps = {
    searchValue: '',
  };

  render() {
    return (
      <MessengerContext.Consumer>
        {context => {
          const { Loader, ListNoContent } = context.components;
          console.log(this.props.conversations);

          return this.props.conversations && this.props.viewer ? (
            this.props.conversations.length ? (
              <ListRenderer
                activeConversationId={this.props.activeConversationId}
                conversations={this.props.conversations}
                onRequestConversationDetail={
                  this.props.onRequestConversationDetail
                }
                viewer={this.props.viewer}
              />
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

const mapState = (state, props) => {
  const searchValue = props.searchValue || '';
  return {
    conversations: select
      .conversations(state)
      .filter(conversations =>
        conversations.title.toLowerCase().includes(searchValue.toLowerCase())
      ),
    viewer: select.viewer(state),
  };
};

export const ConversationsList = connect(mapState)(Renderer);
