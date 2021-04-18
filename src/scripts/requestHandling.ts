import {moduleName} from './consts.js'

let lastMessageId = 0;

type MessageData = {
  userReady: null, // the user finished loading
  ping: null, // checking connection to other users
  pong: null, // response to ping
  scenePreloadComplete: { // finished preloading a scene
    sceneId: string
  }
}
type Message<T extends keyof MessageData> = {
  type: T
  socketId: string
  data: MessageData[T]
  messageId: number
  target: string
}
type ProcessedMessage<T extends keyof MessageData> = Message<T> & {userId: string}


// helper types to filter out the keys with some value
type Filter<Obj, Value> = {
  [K in keyof Obj]: Obj[K] extends Value ? K : never;
}[keyof Obj];
type FilterNot<Obj, Value> = Exclude<keyof Obj, Filter<Obj, Value>>;



export class RequestManager {
  /**
   * send a message to ther clients
   * @param {string} type the type of the message
   * @param {} data there's no data for this type of message
   * @param {string} target socket id of the target client
   */
  static emit<T extends Filter<MessageData, null>>({type, data, target}:{type: T, data?: MessageData[T], target?: string}): void;
  /**
   * send a message to ther clients
   * @param {string} type the type of the message
   * @param {object} data the data to be sent
   * @param {string} target socket id of the target client
   */
  static emit<T extends FilterNot<MessageData, null>>({type, data, target}: {type: T, data: MessageData[T], target?: string}): void;

  static emit<T extends keyof MessageData>({type, data, target}: {type: T, data?: MessageData[T], target?: string}) {
    lastMessageId++;
    const message: Message<T> = {type, socketId: game.socket.id, data, messageId: lastMessageId, target}
    game.socket.emit(`module.${moduleName}`, message);
  }
  static on<T extends keyof MessageData>(type: T, callback: (processedMessage: ProcessedMessage<T>) => void, filter?: (processedMessage: ProcessedMessage<T>) => boolean) {
    return game.socket.on(`module.${moduleName}`, (message: Message<T>, userId: string) => {
      if (message.type !== type) {
        return;
      }
      if (message.target && message.target !== game.socket.id) {
        return;
      }
      const processedMessage: ProcessedMessage<T> = {...message, userId};
      if (filter && filter(processedMessage)) {
        return;
      }
      callback(processedMessage);
    })
  }
}
