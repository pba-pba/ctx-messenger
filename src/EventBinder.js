// @flow

import * as React from 'react';

type Props = {
  didMount?: Function,
  willUnmount?: Function
};

export class EventBinder extends React.Component<Props> {
  componentDidMount() {
    if (typeof this.props.didMount === 'function') {
      this.props.didMount();
    }
  }

  componentWillUnmount() {
    if (typeof this.props.willUnmount === 'function') {
      this.props.willUnmount();
    }
  }

  render() {
    return null;
  }
}
