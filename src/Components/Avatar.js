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
    return renderImage(users[0].profile_photo_url, [size, size]);
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          { width: this.props.size, height: this.props.size, borderRadius: this.props.size / 2 },
        ]}
      >
        {this.renderLayout()}
      </View>
    );
  }
}

function renderImage(uri: string, [width, height]: [number, number]) {
  return (
    <Image
      source={{ uri: uri }}
      style={{
        overflow: 'hidden',
        width: width,
        height: height,
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
});
