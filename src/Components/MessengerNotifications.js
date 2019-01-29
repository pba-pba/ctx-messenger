// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import { select } from '../store';

type CP = {
  notifications: Object,
};

type Props = CP & {
  children(CP): React.Node,
};

function MessengerNotificationsRenderer(props: Props) {
  return props.children(props.notifications);
}

const mapState = state => ({
  notifications: select.notifications(state),
});

export const MessengerNotifications = connect(mapState)(MessengerNotificationsRenderer);
