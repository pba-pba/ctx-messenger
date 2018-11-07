// @flow

import type { ChatConversation, ChatState } from './types';

export type Users = {
  names: Array<string>,
  name: string,
  sources: Array<{ uri: string }>,
  status: 'online' | 'offline' | null,
  ids: Array<string>,
};

export function formatUsers(
  conversation: ChatConversation,
  state: ChatState,
): {
  names: Array<string>,
  name: string,
  sources: Array<{ uri: string }>,
  status: 'online' | 'offline' | null,
} {
  const users = conversation.users.filter(user => user.id !== state.self.id).reduce(
    (acc, user) => {
      acc.sources.push('https://www.w3schools.com/howto/img_avatar.png');
      acc.names.push(user.name);
      acc.ids.push(user.id);
      return acc;
    },
    {
      ids: [],
      sources: [],
      names: [],
      status: null,
      name: '',
    },
  );

  if (users.names.length === 1) {
    const contact = state.contacts.find(contact => contact.user.id === users.ids[0]);
    users.name = users.names.join(', ');
    if (contact) {
      users.status = contact.online === true ? 'online' : 'offline';
    }
  } else {
    const original = users.names;

    users.names = users.names.map(name => name.split(' ')[0]).splice(0, 2);
    users.name = users.names.join(', ');

    if (original.length > users.names.length) {
      users.name += ` and ${original.length - users.names.length} more`;
    }
  }

  return users;
}

export function findConversationByUsers(state: ChatState, userIds: Array<string>) {
  return state.conversations
    .filter(conversation => conversation.users.length === userIds.length)
    .find(conversation => {
      const includes = conversation.users
        .map(user => userIds.includes(user.id))
        .some(bool => bool === false);

      return includes === false;
    });
}
