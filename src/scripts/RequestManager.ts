import {moduleName} from './consts.js'

//#region types
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
  clientId: string
  data: MessageData[T]
  messageId: number
  target: string
}
type ProcessedMessage<T extends keyof MessageData> = Message<T> & {userId: string}

// helper type to filter out the keys with some value
type Filter<Obj, Value> = {
  [K in keyof Obj]: Obj[K] extends Value ? K : never;
}[keyof Obj];
type FilterNot<Obj, Value> = Exclude<keyof Obj, Filter<Obj, Value>>;

type MessageOptions<T extends keyof MessageData> = 
  {target?: string} & 
  (T extends Filter<MessageData, null>? {data?: MessageData[T]}: {data: MessageData[T]})
//#endregion


/**
 * send a message to ther clients
 * @param {string} type the type of the message
 * @param {object} data the data to be sent
 * @param {string} target socket id of the target client
 */
export function emit<T extends Filter<MessageData, null>>(type: T, {data, target}?: MessageOptions<T>): void;
export function emit<T extends FilterNot<MessageData, null>>(type: T, {data, target}: MessageOptions<T>): void;
export function emit<T extends keyof MessageData>(type: T, {data, target}: {data?: MessageData[T], target?: string} = {}) {
  lastMessageId++;
  const message: Message<T> = {type, clientId: game.socket.id, data, messageId: lastMessageId, target}
  game.socket.emit(`module.${moduleName}`, message);
}

export function on<T extends keyof MessageData>(type: T, callback: (processedMessage: ProcessedMessage<T>) => void, filter?: (processedMessage: ProcessedMessage<T>) => boolean) {
  function callbackWrapper(message: Message<T>, userId: string) {
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
  }
  game.socket.on(`module.${moduleName}`, callbackWrapper);
  return callbackWrapper;
}

export function once<T extends keyof MessageData>(type: T, callback: (processedMessage: ProcessedMessage<T>) => void, filter?: (processedMessage: ProcessedMessage<T>) => boolean) {
  const socketHook = on(type, (processedMessage) => {
    game.socket.off(`module.${moduleName}`, socketHook);
    callback(processedMessage);
  }, filter)
}

let lastMessageId = 0;
