// @flow

import { createConnection, type Config } from './Connection';
import type { SocketResponse, SocketAction } from '../types';

type ExtendedConfig = {|
  dispatch(SocketAction): void,
  socketUrl: string,
|};

export class ConnectionManager {
  config: ExtendedConfig;
  connection: $Call<typeof createConnection, Config>;

  constructor(config: ExtendedConfig) {
    this.config = config;
    this.connection = createConnection({
      onMessage: this.onMessage,
      socketUrl: config.socketUrl,
      reconnect: config.reconnect,
    });
  }

  send(...args: Array<Object>) {
    this.connection.send(...args);
  }

  close = () => {
    this.connection.close();
  };

  onMessage = (message: SocketResponse) => {
    const action = getAction(message);
    if (action) {
      this.config.dispatch(action);
    }
  };
}

function getAction(obj: SocketResponse): null | SocketAction {
  if (obj.type) {
    // $FlowExpectedError
    return obj;
  }

  if (obj.message && obj.message.type) {
    return obj.message;
  }

  return null;
}
