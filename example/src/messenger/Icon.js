import * as React from 'react';
import { Text, View, StyleSheet } from 'react-primitives';

export function Icon(props) {
  const style = StyleSheet.flatten([
    props.style,
    {
      width: 30,
      height: 30,
      backgroundColor: '#ccc',
    },
  ]);
  return <View {...props} style={style} />;
}
