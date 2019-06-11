// @flow

import { schema } from 'normalizr';

export const UserSchema = new schema.Entity('users');

export const MessageSchema = new schema.Entity(
  'messages',
  { user: UserSchema },
  { idAttribute: 'client_message_id' },
);

export const DetailSchema = new schema.Entity(
  'details',
  { messages: [MessageSchema] },
  { idAttribute: 'conversation_id' },
);

export const ConversationSchema = new schema.Entity('conversations', {
  users: [UserSchema],
  last_message: MessageSchema,
});

export const GlobalSearchSchema = new schema.Entity('global_search', {
  conversations: [ConversationSchema],
  users: [UserSchema],
});
