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
|};

class Renderer extends React.Component<Props> {
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

export const ConversationsList = connect(mapState)(Renderer);
