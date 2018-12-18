// @flow

import * as React from 'react';

type Props = {
  didMount?: Function,
  willMount?: Function
};

export class EventBinder extends React.Component<Props> {
  componentDidMount() {
    if (typeof this.props.didMount === 'function') {
      this.props.didMount();
    }
  }

  componentWillUnmount() {
    if (typeof this.props.willMount === 'function') {
      this.props.willMount();
    }
  }

  render() {
    return null;
  }
}
