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

function MessagesEndList(props: any) {
  return <Text>`MessagesEndList` component not defined</Text>;
}

function ListNoContent(props: any) {
  return <Text>`ListNoContent` component not defined</Text>;
}

function AttachmentIcon(props: any) {
  return <Text>`AttachmentIcon` component not defined</Text>;
}

function WhiteboardIcon(props: any) {
  return <Text>`WhiteboardIcon` component not defined</Text>;
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
    MessagesEndList: MessagesEndList,
    ListNoContent: ListNoContent,
  },
  icons: {
    AttachmentIcon: AttachmentIcon,
    WhiteboardIcon: WhiteboardIcon,
  },
  functions: {
    openAttachmentPicker() {
      console.log('open attachment picker')
    },
    openWhiteboard() {
      console.log('open whiteboard')
    }
  }
});
