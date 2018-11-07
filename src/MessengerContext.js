// @flow

import * as React from 'react';
import { Text } from 'react-primitives';

function Input(props: any) {
  return <Text>`Input` component not defined</Text>;
}

function Loader(props: any) {
  return <Text>`Loader` component not defined</Text>;
}

function MessagesScrollView(props: any) {
  return <Text>`MessagesScrollView` component not defined</Text>;
}

export const MessengerContext = React.createContext({
  colors: {
    brand: '#FC612D',
    grayText: '#90A4AE',
    blackText: '#455A64',
  },
  components: {
    Input: Input,
    Loader: Loader,
    MessagesScrollView: MessagesScrollView,
  },
});
