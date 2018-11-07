// @flow

import * as React from 'react';
import { View, Text, StyleSheet, Touchable } from 'react-primitives';
import {
  Avatar,
  MessengerContext,
  UserAutocompleteManager,
} from 'ctx-messenger';
import type { ChatUser } from 'ctx-messenger/types';
import { Icon } from '../Icon';

type Props = {};

type State = {
  search: string,
};

export class ConversationStarter extends React.Component<Props, State> {
  state = {
    search: '',
  };

  addUser = (manager: *, user: ChatUser) => {
    const nextDraft = { ...manager.draft };
    nextDraft.users = nextDraft.users.concat(user);
    manager.setDraft(nextDraft);
  };

  removeUser = (manager: *, user: ChatUser) => {
    const nextDraft = { ...manager.draft };
    nextDraft.users = nextDraft.users.filter(({ id }) => id !== user.id);
    nextDraft.id = undefined;
    manager.setDraft(nextDraft);
  };

  renderAutocomplete(components: *, manager: *) {
    const { Input } = components;
    return (
      <View style={styles.acInputRow}>
        {this.state.search.length >= 3 && (
          <View style={styles.acList}>
            {manager.searchedUsers.map(user => (
              <Touchable
                key={user.id}
                onPress={() => {
                  this.setState({ search: '' });
                  this.addUser(manager, user);
                }}
              >
                <View style={styles.acRow}>
                  <View style={styles.acAvatar}>
                    <Avatar users={[user]} size={28} />
                  </View>
                  <Text>{user.name}</Text>
                </View>
              </Touchable>
            ))}
          </View>
        )}
        <Input
          style={{ borderWidth: 0, backgroundColor: 'white', padding: 5 }}
          value={this.state.search}
          placeholder="Type a name..."
          autoFocus
          onChangeText={value => {
            this.setState({ search: value });
            if (value.length >= 3) {
              manager.searchUsersByTerm(value);
            }
          }}
        />
      </View>
    );
  }

  renderStaticNames(conversation: *) {
    return (
      <View style={styles.staticNamesContainer}>
        <Text style={styles.staticName}>
          {conversation.users.map(user => user.name).join(', ')}
        </Text>
      </View>
    );
  }

  renderEditableNames(draft: *, manager: *) {
    return (
      <View style={styles.staticNamesContainer}>
        {draft.users.map(user => (
          <Touchable
            key={user.id}
            onPress={() => this.removeUser(user, manager)}
          >
            <View style={styles.nameBubble}>
              <Text style={styles.staticName}>{user.name}</Text>
            </View>
          </Touchable>
        ))}
      </View>
    );
  }

  render() {
    return (
      <UserAutocompleteManager>
        {manager => {
          const { conversationSlim, draft } = manager;
          return (
            <MessengerContext.Consumer>
              {context => (
                <View style={styles.container}>
                  {draft === undefined &&
                    conversationSlim &&
                    this.renderStaticNames(conversationSlim)}
                  {draft && this.renderEditableNames(draft, manager)}
                  {draft &&
                    this.renderAutocomplete(context.components, manager)}
                  <View style={styles.iconsContainer}>
                    {draft && (
                      <Touchable onPress={() => manager.setDraft(undefined)}>
                        <Icon
                          name="close"
                          size={24}
                          color={context.colors.brand}
                        />
                      </Touchable>
                    )}
                    {conversationSlim && draft === undefined && (
                      <Touchable
                        onPress={() =>
                          manager.setDraft({
                            ...conversationSlim,
                            id: undefined,
                          })
                        }
                      >
                        <Icon
                          name="user-plus"
                          size={24}
                          color={context.colors.brand}
                        />
                      </Touchable>
                    )}
                  </View>
                </View>
              )}
            </MessengerContext.Consumer>
          );
        }}
      </UserAutocompleteManager>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 44,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  acInputRow: {
    flexDirection: 'row',
    minWidth: 300,
  },
  acList: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    marginBottom: 10,
    marginTop: 5,
    marginLeft: 5,
    flexDirection: 'column',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfdfdf',
  },
  acRow: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#dfdfdf',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    flexShrink: 0,
  },
  acAvatar: {
    width: 28,
    height: 28,
    backgroundColor: '#ccc',
    marginRight: 10,
    borderRadius: 14,
    overflow: 'hidden',
  },
  staticNamesContainer: {
    flexDirection: 'row',
  },
  iconsContainer: {
    marginLeft: 'auto',
  },
  staticName: {
    color: '#455A64',
    fontSize: 15,
    fontWeight: '500',
  },
  nameBubble: {
    backgroundColor: '#eee',
    padding: 5,
    marginRight: 5,
    position: 'relative',
    flexDirection: 'row',
    borderRadius: 5,
  },
});
