// @flow

import * as React from 'react';
import { View, StyleSheet } from 'react-primitives';

type Props = {
  context: *,
  attachments: string[],
};

type State = {
  attachments: Array<Object>,
};

function AttachmentPlaceholder() {
  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <View style={styles.icon} />
      </View>
      <View style={styles.wrapper}>
        <View style={styles.text} />
        <View style={styles.text} />
      </View>
    </View>
  );
}

export class MessageAttachments extends React.Component<Props, State> {
  state = {
    attachments: [],
  };

  async componentDidMount() {
    const services = this.props.attachments.map(id =>
      this.props.context.functions.getAttachment(id),
    );
    const responses = await Promise.all(services);
    const attachments = responses.map(response => response.data);

    this.setState({ attachments });
  }

  renderFiles = () => {
    const { Files } = this.props.context.components;
    return <Files files={this.state.attachments} />;
  };

  renderPlaceholders = () => {
    return this.props.attachments.map((attachment, index) => <AttachmentPlaceholder key={index} />);
  };

  render() {
    return this.state.attachments.length ? this.renderFiles() : this.renderPlaceholders();
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    width: 285,
    paddingTop: 10,
  },
  image: { width: 46, height: 56, alignItems: 'center', justifyContent: 'center' },
  wrapper: { flex: 1, paddingLeft: 15 },
  text: { height: 14, marginVertical: 2, borderRadius: 3, backgroundColor: '#eee', flexGrow: 1 },
  icon: { width: 39, height: 50, borderRadius: 3, backgroundColor: '#eee' },
});
