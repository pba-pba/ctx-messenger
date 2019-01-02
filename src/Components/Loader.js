// @flow

import * as React from 'react';
import { Text, View } from 'react-primitives';

type Props = {};

type State = {};

export class Loader extends React.Component<Props, State> {
  render() {
    return <Text>Loading</Text>;
  }
}

export class CenteredLoader extends React.Component<Props, State> {
  render() {
    return (
      <View
        style={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,.25)',
        }}
      >
        <Loader />
      </View>
    );
  }
}
