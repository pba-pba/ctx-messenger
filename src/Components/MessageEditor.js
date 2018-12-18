// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import { View, Text, Touchable, StyleSheet, Platform } from 'react-primitives';

import { select } from '../store';
import { sendMessage } from '../store/actions';
import { MessengerContext } from '../MessengerContext';

type Props = {
  activeConversationId: void | string,
};

type CP = {
  sendMessage: *,
};

type State = {
  message: string,
};

class Renderer extends React.Component<Props & CP, State> {
  state = {
    message: '',
  };

  sendMessage = () => {
    if (this.state.message.length > 0) {
      this.props.sendMessage(this.state.message);
      this.setState({ message: '' });
    }
  };

  render() {
    return (
      <MessengerContext.Consumer>
        {context => {
          const { Input } = context.components;
          const { colors } = context;
          return (
            <View style={styles.container}>
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Input
                  onChangeText={val => this.setState({ message: val })}
                  onSubmit={this.sendMessage}
                  value={this.state.message}
                  placeholder="Write message"
                  style={
                    Platform.OS === 'web'
                      ? styles.inputWeb
                      : styles.inputMobile
                  }
                  onKeyDown={evt => {
                    if (evt.key === 'Enter' && evt.shiftKey === false) {
                      evt.preventDefault();
                      this.sendMessage();
                    }
                  }}
                />
              </View>
              <Touchable onPress={this.sendMessage}>
                <View style={styles.buttonWrapper}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '500',
                      color: colors.brand,
                    }}
                  >
                    Send
                  </Text>
                </View>
              </Touchable>
            </View>
          );
        }}
      </MessengerContext.Consumer>
    );
  }
}

const mapState = (state, props) => ({
  activeConversationId: select.activeConversationId(state)
});

const mapDispatch = (dispatch: Dispatch<*>, ownProps: Props) => ({
  sendMessage: (message: string) => {
    dispatch(sendMessage(message));
  }
});

export const MessageEditor = connect(mapState, mapDispatch)(Renderer);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowColor: 'rgba(117,120,128,0.15)',
        shadowOpacity: 1,
        shadowRadius: 10,
      },
      android: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(117,120,128,0.5)',
      },
    }),
  },
  buttonWrapper: {
    padding: 10
  },
  inputMobile: {
    backgroundColor: '#ECEFF1',
    minHeight: 30,
    borderRadius: 15,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderWidth: 0,
  },
  inputWeb: { width: '100%' }
});
