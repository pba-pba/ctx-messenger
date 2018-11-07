// @flow

import * as React from 'react';

type Props = {
  value: string,
  onChangeText(string): mixed,
  onSubmit(): mixed,
};

export function Input(props: Props) {
  const { onChangeText, onSubmit, ...bag } = props;
  return (
    <form style={{ width: '100%' }} onSubmit={e => e.preventDefault()}>
      <input {...bag} onChange={e => onChangeText(e.target.value)} />
    </form>
  );
}
