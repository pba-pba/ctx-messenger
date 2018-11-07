// @flow

import { schema } from 'normalizr';

export const UserSchema = new schema.Entity('users');

export const ConversationSchema = new schema.Entity('conversations', {
  users: [UserSchema],
});

export const MessageSchema = new schema.Entity(
  'messages',
  {},
  { idAttribute: 'client_message_id' },
);

export const DetailSchema = new schema.Entity(
  'details',
  {
    messages: [MessageSchema],
  },
  {
    idAttribute: 'conversation_id',
  },
);
