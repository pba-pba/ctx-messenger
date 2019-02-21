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

function FileComponent(props: any) {
  return <Text>`FileComponent` component not defined</Text>;
}

function CallStartIcon(props: any) {
  return <Text>`CallStartIcon` component not defined</Text>;
}

function CallEndIcon(props: any) {
  return <Text>`CallEndIcon` component not defined</Text>;
}

function ListSearchNoContent(props: any) {
  return <Text>`ListSearchNoContent` component not defined</Text>;
}

export const MessengerContext = React.createContext({
  colors: {
    brand: '#FC612D',
    grayText: '#90A4AE',
    blackText: '#455A64',
  },
  components: {
    Files: FileComponent,
    Input: Input,
    ListNoContent: ListNoContent,
    ListSearchNoContent: ListSearchNoContent,
    Loader: Loader,
    MessagesEndList: MessagesEndList,
    MessagesScrollView: MessagesScrollView,
  },
  icons: {
    AttachmentIcon: AttachmentIcon,
    WhiteboardIcon: WhiteboardIcon,
    CallStartIcon: CallStartIcon,
    CallEndIcon: CallEndIcon,
  },
  functions: {
    openAttachmentPicker() {
      console.log('open attachment picker');
    },
    openWhiteboard() {
      console.log('open whiteboard');
    },
    uploadFile() {
      console.log('upload attachment');
    },
    getAttachment() {
      console.log('get attachment');
    },
    onPress() {
      console.log('on press');
    },
  },
});
