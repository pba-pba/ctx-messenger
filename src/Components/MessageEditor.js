// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import { View, Text, Touchable, StyleSheet } from 'react-primitives';

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
  activeConversationId: select.activeConversationId(state),
});

const mapDispatch = (dispatch: Dispatch<*>, ownProps: Props) => ({
  sendMessage: (message: string) => {
    dispatch(sendMessage(message));
  },
});

export const MessageEditor = connect(
  mapState,
  mapDispatch,
)(Renderer);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonWrapper: {
    padding: 10,
  },
});
