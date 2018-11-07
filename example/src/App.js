import React, { Component } from 'react';
import { Messenger } from './messenger';

export default class App extends Component {
  render() {
    return (
      <div
        style={{
          width: '100ww',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'red',
        }}
      >
        <Messenger
          socketUrl="wss://messaging-staging.poweredbyaction.org/cable"
          accessToken="a975c6e98e479b5f8660f0f2b4c73876cceb20d72f62c6b507066de2754a62ea"
          activeConversationId="p58urX"
        />
      </div>
    );
  }
}
