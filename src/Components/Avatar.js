// @flow

import * as React from 'react';
import { View, StyleSheet, Image } from 'react-primitives';
import type { ChatUser } from '../types';

type Props = {
  users: ChatUser[],
  size: number,
};

type State = {};

export class Avatar extends React.Component<Props, State> {
  renderLayout(): React.Node {
    const { users, size } = this.props;
    if (users.length === 2) {
      return (
        <View style={styles.twoInRow}>
          {renderImage(users[0].profile_photo_url, [size / 2, size])}
          <View style={styles.verticalSpace} />
          {renderImage(users[1].profile_photo_url, [size / 2, size])}
        </View>
      );
    }
    if (users.length === 3) {
      return (
        <View>
          <View style={styles.twoInRow}>
            {renderImage(users[0].profile_photo_url, [size / 2, size / 2])}
            <View style={styles.verticalSpace} />
            {renderImage(users[1].profile_photo_url, [size / 2, size / 2])}
          </View>
          <View style={styles.horizontalSpace} />
          {renderImage(users[2].profile_photo_url, [size, size / 2])}
        </View>
      );
    }

    if (users.length === 4) {
      return (
        <View>
          <View style={styles.twoInRow}>
            {renderImage(users[0].profile_photo_url, [size / 2, size / 2])}
            <View style={styles.verticalSpace} />
            {renderImage(users[1].profile_photo_url, [size / 2, size / 2])}
          </View>
          <View style={styles.twoInRow}>
            {renderImage(users[2].profile_photo_url, [size / 2, size / 2])}
            <View style={styles.verticalSpace} />
            {renderImage(users[3].profile_photo_url, [size / 2, size / 2])}
          </View>
        </View>
      );
    }
    return renderImage(users[0].profile_photo_url, [size, size], size / 2);
  }

  render() {
    const { size } = this.props;
    return (
      <View style={{ width: size, height: size }}>
        <View
          style={[
            styles.container,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          {this.renderLayout()}
        </View>
        {this.props.users.length === 1 ? renderDot(size, this.props.users[0]) : null}
      </View>
    );
  }
}

function renderDot(size: *, user: *) {
  size = Math.min(size * 0.46, 14);
  return user.online ? (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#00e676',
        },
      ]}
    />
  ) : null;
}

function renderImage(uri: string, [width, height]: [number, number], radius?: number) {
  return (
    <Image
      source={{ uri: uri }}
      style={{
        overflow: 'hidden',
        width: width,
        height: height,
        borderRadius: radius || 0,
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  verticalSpace: {
    width: 1,
  },
  horizontalSpace: {
    height: 1,
  },
  twoInRow: {
    flexDirection: 'row',
  },
  dot: {
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    right: -2,
    bottom: -2,
  },
});
