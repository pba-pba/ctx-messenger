// @flow

import React from 'react';
import { Text, View, Platform } from 'react-primitives';

import { MessengerContext } from '../../MessengerContext';
import { styles } from './styles';

type TextProps = {
  keys: string[],
};

type InlineTextProps = {
  key: string,
};

type ChildrenProps = Array<*>;

function renderText(
  style:
    | 'unstyled'
    | 'header-one'
    | 'header-two'
    | 'header-three'
    | 'header-four'
    | 'header-five'
    | 'header-six',
  color?: string,
) {
  return (children: ChildrenProps, props: TextProps) =>
    children.map((child, index) => (
      <Text key={props.keys[index]} style={[styles[style], color ? { color: color } : undefined]}>
        {child}
      </Text>
    ));
}

function renderInlineText(style: 'bold' | 'italic' | 'underline' | 'code', color?: string) {
  return (children: ChildrenProps, props: InlineTextProps) => (
    <Text key={props.key} style={[styles[style], color ? { color: color } : undefined]}>
      {children}
    </Text>
  );
}

function renderBreaklines(style: 'blockquote' | 'code-block', color?: string) {
  return (children: ChildrenProps, props: TextProps) => (
    <Text key={props.keys.join('|')} style={[styles[style], color ? { color: color } : undefined]}>
      {children.map(child => [child, '\n'])}
    </Text>
  );
}

function renderList(type: 'ordered' | 'unordered', color?: string) {
  return (children: ChildrenProps, props: TextProps) => (
    <View key={props.keys.join('|')} style={styles.list}>
      {children.map((child, index) => (
        <View key={props.keys[index]}>
          <Text style={[styles.listItem, color ? { color: color } : undefined]}>
            <Text>{type === 'ordered' ? `${index + 1}. ` : '· '}</Text>
            {child}
          </Text>
        </View>
      ))}
    </View>
  );
}

const WEB_ENTITIES = {
  // key is the entity key value from raw
  LINK: (children: ChildrenProps, data: *, props: InlineTextProps) => (
    <a href={data.url} target="_blank" style={styles.link} key={props.key}>
      {children}
    </a>
  ),
  mention: (children: ChildrenProps, data: *, props: InlineTextProps) => (
    <a href={data.url} style={styles.mention} key={props.key}>
      {' '}
      {children}{' '}
    </a>
  ),
};

const MOBILE_ENTITIES = {
  // key is the entity key value from raw
  LINK: (children: ChildrenProps, data: *, props: InlineTextProps) => (
    <MessengerContext.Consumer key={props.key}>
      {context => (
        <Text onPress={context.functions.onPress('link', data)} style={styles.link}>
          {children}
        </Text>
      )}
    </MessengerContext.Consumer>
  ),
  mention: (children: ChildrenProps, data: *, props: InlineTextProps) => (
    <MessengerContext.Consumer key={props.key}>
      {context => (
        <Text onPress={context.functions.onPress('mention', data)} style={styles.mention}>
          {' '}
          {children}{' '}
        </Text>
      )}
    </MessengerContext.Consumer>
  ),
};

export const renderers = (color?: string) => ({
  /**
   * Those callbacks will be called recursively to render a nested structure
   */
  inline: {
    // The key passed here is just an index based on rendering order inside a block
    BOLD: renderInlineText('bold', color),
    ITALIC: renderInlineText('italic', color),
    UNDERLINE: renderInlineText('underline', color),
    CODE: renderInlineText('code', color),
  },
  /**
   * Blocks receive children and depth
   * Note that children are an array of blocks with same styling,
   */
  blocks: {
    unstyled: renderText('unstyled', color),
    blockquote: renderBreaklines('blockquote', color),
    'header-one': renderText('header-one', color),
    'header-two': renderText('header-two', color),
    'header-three': renderText('header-three', color),
    'header-four': renderText('header-four', color),
    'header-five': renderText('header-five', color),
    'header-six': renderText('header-six', color),
    // You can also access the original keys of the blocks
    'code-block': renderBreaklines('code-block', color),
    // or depth for nested lists
    'unordered-list-item': renderList('unordered', color),
    'ordered-list-item': renderList('ordered', color),
    // If your blocks use meta data it can also be accessed like keys
    atomic: (children: ChildrenProps, props: TextProps) => children.map((child, i) => null),
  },
  /**
   * Entities receive children and the entity data
   */
  entities: Platform.OS === 'web' ? WEB_ENTITIES : MOBILE_ENTITIES,
});
