import React, { Component } from 'react';
import { Messenger } from './messenger';

export default class App extends Component {
  state = {
    activeConversationId: 'p58urX',
  };

  render() {
    return (
      <div
        style={{
          width: '100ww',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Messenger
          socketUrl="wss://messaging-staging.poweredbyaction.org/cable"
          accessToken="bd051248a796c5b8fac9a9df25f419881599d4a23a9bc9f5412e33ab6659d06d"
          activeConversationId={this.state.activeConversationId}
          onRequestConversationDetail={activeConversationId =>
            this.setState({ activeConversationId })
          }
        />
      </div>
    );
  }
}
