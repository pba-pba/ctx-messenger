// @flow

import * as React from 'react';
import ScrollView from 'react-inverted-scrollview';
import { Icon } from './Icon';
import {
  store,
  actions,
  MessengerCore,
  ConversationsList,
  ConversationDetail,
  MessageEditor,
} from 'ctx-messenger';
// import { ConversationStarter } from './components/ConversationStarter';
import { Input } from './components/Input.web';
import { Loader } from './components/Loader.web';
import { ListNoContent } from './components/ListNoContent.web';

const COMPONENTS = {
  Input: Input,
  Loader: Loader,
  MessagesScrollView: ScrollView,
  ListNoContent: ListNoContent,
};

function ConversationStarter() {
  return 'conversation starter';
}

type Props = {
  accessToken: string,
  activeConversationId: *,
  onRequestConversationDetail: *,
  socketUrl: string,
};

type State = {};

export class Messenger extends React.Component<Props, State> {
  render() {
    return (
      <MessengerCore
        onConversationsCreated={ids => {
          this.props.onRequestConversationDetail(ids[0]);
        }}
        // $FlowExpectedError
        socketUrl={this.props.socketUrl}
        accessToken={this.props.accessToken}
        colors={{
          brand: '#FC612D',
          grayText: '#90A4AE',
          blackText: '#455A64',
        }}
        components={COMPONENTS}
      >
        <div
          style={{
            background: 'red',
            flex: 1,
            border: '1px solid rgba(144,164,174,0.3)',
            position: 'relative',
          }}
        >
          <div
            key={this.props.activeConversationId || 'no-conversation'}
            style={{
              position: 'absolute',
              left: 300,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              background: 'pink',
            }}
          >
            <div
              style={{
                borderBottom: '1px solid rgba(144,164,174,0.3)',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <ConversationStarter {...this.props} />
            </div>
            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
              <ConversationDetail
                activeConversationId={this.props.activeConversationId}
              />
            </div>
            <div style={{ borderTop: '1px solid rgba(144,164,174,0.3)' }}>
              <MessageEditor {...this.props} />
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: 300,
              borderRight: '1px solid rgba(144,164,174,0.3)',
            }}
          >
            <div style={{ borderRight: '1px solid rgba(144,164,174,0.3)' }}>
              <div
                style={{
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  padding: 10,
                }}
              >
                <Icon
                  name="message"
                  color="#FC612D"
                  size={24}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    store.dispatch(actions.createConversation());
                  }}
                />
              </div>
            </div>
            <div
              style={{
                overflow: 'auto',
                position: 'absolute',
                top: 45,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              <ConversationsList
                activeConversationId={this.props.activeConversationId}
                onRequestConversationDetail={
                  this.props.onRequestConversationDetail
                }
              />
            </div>
          </div>
        </div>
      </MessengerCore>
    );
  }
}
