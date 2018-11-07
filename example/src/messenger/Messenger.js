// @flow

import * as React from 'react';
import ScrollView from 'react-inverted-scrollview';
import { Touchable } from 'react-primitives';
import {
  store,
  actions,
  MessengerCore,
  ConversationsList,
  ConversationDetail,
  MessageEditor,
} from 'ctx-messenger';
import { Icon } from './Icon';
import { ConversationStarter } from './components/ConversationStarter';
import { Input } from './components/Input.web';
import { Loader } from './components/Loader.web';

type Props = {
  accessToken: string,
  activeConversationId: *,
  onRequestConversationDetail: *,
  socketUrl: string,
};

type State = {};

const COMPONENTS = {
  Input: Input,
  Loader: Loader,
  MessagesScrollView: ScrollView,
};

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
        <div style={styles.wrapper}>
          <div
            key={this.props.activeConversationId || 'no-conversation'}
            style={styles.rightPanel}
          >
            <div style={styles.membersHeading}>
              <ConversationStarter {...this.props} />
            </div>
            <div style={styles.messagesListing}>
              <ConversationDetail
                activeConversationId={this.props.activeConversationId}
              />
            </div>
            <div style={styles.messageComposer}>
              <MessageEditor {...this.props} />
            </div>
          </div>
          <div style={styles.conversationsListingPanel}>
            <div style={styles.conversationListingHeader}>
              <div style={styles.createConversationIcon}>
                <Touchable
                  onPress={() => {
                    store.dispatch(actions.createConversation());
                  }}
                >
                  <Icon
                    name="message"
                    color="#FC612D"
                    size={24}
                    style={{ cursor: 'pointer' }}
                  />
                </Touchable>
              </div>
            </div>
            <div style={styles.conversationsList}>
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

const styles = {
  wrapper: {
    background: 'white',
    flex: '1',
    border: '1px solid rgba(144,164,174,0.3)',
    position: 'relative',
  },
  rightPanel: {
    position: 'absolute',
    left: '300px',
    right: '0',
    top: '0',
    bottom: '0',
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
  },
  conversationsListingPanel: {
    position: 'absolute',
    top: '0',
    left: '0',
    bottom: '0',
    width: '300px',
    borderRight: '1px solid rgba(144,164,174,0.3)',
  },
  conversationListingHeader: {
    borderBottom: '1px solid rgba(144,164,174,0.3)',
  },
  createConversationIcon: {
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '10px',
  },
  conversationsList: {
    overflow: 'auto',
    position: 'absolute',
    top: '45px',
    bottom: '0',
    left: '0',
    right: '0',
  },
  membersHeading: {
    borderBottom: '1px solid rgba(144,164,174,0.3)',
    position: 'relative',
    zIndex: '2',
  },
  messagesListing: { flex: '1', position: 'relative', zIndex: '1' },
  messageComposer: { borderTop: '1px solid rgba(144,164,174,0.3)' },
};
