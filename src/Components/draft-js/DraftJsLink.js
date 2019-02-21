// @flow

import React from 'react';
import { Image, StyleSheet, Text, Touchable, View, Platform } from 'react-primitives';

import { MessengerContext } from '../../MessengerContext';

type Props = {
  entityMap: {
    data: {
      description: string,
      name: string,
      thumbnail_url: string,
      title: string,
      url: string,
    },
  },
};

export function DraftJsLink(props: Props) {
  if (!props.entityMap.data.url) {
    return null;
  }

  const matches = props.entityMap.data.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  const domain = matches && matches[1];

  if (!domain) {
    return null;
  }

  function renderText() {
    return (
      <View style={styles.wrapper}>
        {domain ? (
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.name}>
            {domain.replace('www.', '').toUpperCase()}
          </Text>
        ) : null}
        {props.entityMap.data.name ? (
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
            {props.entityMap.data.name}
          </Text>
        ) : null}
        {props.entityMap.data.description ? (
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.description}>
            {props.entityMap.data.description}
          </Text>
        ) : null}
      </View>
    );
  }

  return Platform.OS === 'web' ? (
    props.entityMap.data.embed_code ? (
      <div dangerouslySetInnerHTML={{ __html: props.entityMap.data.embed_code }} />
    ) : null
  ) : (
    <MessengerContext.Consumer>
      {context => (
        <Touchable onPress={context.functions.onPress('link', props.entityMap.data)}>
          <View style={styles.container}>
            {props.entityMap.data.thumbnail_url ? (
              <Image
                resizeMode="contain"
                source={{ uri: props.entityMap.data.thumbnail_url }}
                style={styles.image}
              />
            ) : null}
            {renderText()}
          </View>
        </Touchable>
      )}
    </MessengerContext.Consumer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#eef1f4',
    // flex: 1,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 10,
  },
  image: {
    width: 100,
    height: '100%',
    backgroundColor: 'black',
  },
  wrapper: { paddingHorizontal: 10, marginVertical: 10, flex: 1 },
  name: { color: '#606770', lineHeight: 16, fontSize: 12 },
  title: {
    color: '#1d1f2a',
    lineHeight: 18,
    fontSize: 14,
    marginVertical: 5,
  },
  description: { color: '#606770', lineHeight: 16, fontSize: 12 },
});
