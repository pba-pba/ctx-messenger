// @flow

import * as React from 'react';
import { View, Text, StyleSheet, Touchable } from 'react-primitives';
import distance_in_words_to_now from 'date-fns/distance_in_words_to_now';
import { MessengerContext } from '../MessengerContext';
import type { ChatMessage } from '../types';

type Props = {
  message: ChatMessage,
  onPress(message: ChatMessage): mixed
};

type State = { };

export class MessageCall extends React.Component<Props, State> {
  render() {
    return (
      <MessengerContext.Consumer>
        {context => (
          <Touchable onPress={() => this.props.onPress(this.props.message)} disabled={this.props.message.message_type === 'call_end'}>
            <View style={{ borderWidth: 1, borderRadius: 3, borderColor: context.colors.grayText, padding: 10 }}>
              <Text style={[styles.text, { color: context.colors.blackText }]}>
                {this.props.message.message_type === 'call_start' ? 'Starting call' : 'This call has ended'}
              </Text>
              <Text style={[styles.timestamp, { color: context.colors.grayText }]}>
                Started at {distance_in_words_to_now(this.props.message.timestamp, {
                  addSuffix: true,
                })}
              </Text>
            </View>
          </Touchable>
        )}
      </MessengerContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '500',
  },
});
