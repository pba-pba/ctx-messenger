// @flow

import type { SocketResponse } from '../types';

export type Config = {|
  onMessage(SocketResponse): void,
  socketUrl: string,
|};

/**
 * Low-level socket connector and communicator
 */
class Connection {
  config: Config;
  ws: WebSocket;

  constructor(config: Config) {
    this.config = config;
    // Create connection
    this.ws = new WebSocket(this.config.socketUrl);
    this.ws.onmessage = this._onSocketMessage;
    this.ws.onerror = this._onSocketError;
  }

  _onSocketMessage = (evt: MessageEvent) => {
    deserializeMessage((evt.data: any))
      .then(message => {
        console.log('receive', message);
        CFG.onMessageFn(message);
        this.config.onMessage(message);
      })
      .catch(error => {
        // DO NOT REMOVE THIS!
        console.warn('Could not connect, report error');
        console.error(error);
      });
  };

  _onSocketError = (evt: Event) => {
    console.error(evt);
  };

  /**
   * Public methods
   */
  close = () => {
    connectionCounter -= 1;
    if (connectionCounter === 0) {
      this.ws.close();
    }
  };

  send = (...args: Array<Object>) => {
    if (this.ws.readyState === WebSocket.OPEN) {
      args.forEach(message => {
        console.log('send', message);
        this.ws.send(serializeMessage(message));
      });
    } else {
      let messages = args
        .map(
          (message, idx) => `\nMessage ${idx + 1}: ${serializeMessage(message)}`
        )
        .join('');

      console.error(
        `Trying to send message on socket not open. Connection status code: ${
          this.ws.readyState
        }. Messages: ${messages}`
      );
    }
  };
}

/**
 * Singleton factory function
 */

let connectionSingleton: ?Connection = null;
let connectionCounter = 0;

export function createConnection(config: Config): Connection {
  connectionCounter += 1;
  connectionSingleton = connectionSingleton
    ? connectionSingleton
    : new Connection(config);
  return connectionSingleton;
}

export function dispatchSocketMessage(message: any) {
  if (connectionSingleton) {
    connectionSingleton.send(message);
  } else {
    console.log('Connection is not ready yet');
  }
}

const CFG = {
  onMessageFn: () => {},
};

export function onMessage(fn) {
  CFG.onMessageFn = fn;
}

/**
 * Message serializer and de-serializer
 */
function serializeMessage(message: Object): string {
  const data = Object.entries(message).reduce((map, [key, value]) => {
    map[key] = typeof value === 'string' ? value : JSON.stringify(value);
    return map;
  }, {});

  return JSON.stringify(data);
}

function deserializeMessage(jsonString: string): Promise<SocketResponse> {
  return new Promise((resolve, reject) => {
    try {
      const obj = JSON.parse(jsonString);
      if (obj.identifier) {
        obj.identifier = JSON.parse(obj.identifier);
      }
      resolve(obj);
    } catch (err) {
      reject(err);
    }
  });
}
