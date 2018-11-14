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
          socketUrl="wss://pba2-messaging-develop.kodujeme.sk/cable"
          accessToken="8aba0a4439287d6ac247b4648e817c155b0a3885b6dfdbd1f5dd3bdf32d96773"
          activeConversationId={this.state.activeConversationId}
          onRequestConversationDetail={activeConversationId =>
            this.setState({ activeConversationId })
          }
        />
      </div>
    );
  }
}
