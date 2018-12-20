// @flow

import * as React from 'react';

type Props = {
  context: *,
  attachments: string[]
};

type State = {
  attachments: Array<Object>
};

export class MessageAttachments extends React.Component<Props, State> {
  state = {
    attachments: []
  }

  async componentDidMount() {
    const services = this.props.attachments.map(id => this.props.context.functions.getAttachment(id))
    const responses = await Promise.all(services);
    const attachments = responses.map(response => response.data);

    this.setState({ attachments });
  }

  render() {
    const { Files } = this.props.context.components
    return <Files files={this.state.attachments} />;
  }
}
