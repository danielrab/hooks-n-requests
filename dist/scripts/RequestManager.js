import { moduleName } from './consts.js';
export function emit(type, { data, target } = {}) {
    lastMessageId++;
    const message = { type, clientId: game.socket.id, data, messageId: lastMessageId, target };
    game.socket.emit(`module.${moduleName}`, message);
}
export function on(type, callback, filter) {
    function callbackWrapper(message, userId) {
        if (message.type !== type) {
            return;
        }
        if (message.target && message.target !== game.socket.id) {
            return;
        }
        const processedMessage = Object.assign(Object.assign({}, message), { userId });
        if (filter && filter(processedMessage)) {
            return;
        }
        callback(processedMessage);
    }
    game.socket.on(`module.${moduleName}`, callbackWrapper);
    return callbackWrapper;
}
export function once(type, callback, filter) {
    const socketHook = on(type, (processedMessage) => {
        game.socket.off(`module.${moduleName}`, socketHook);
        callback(processedMessage);
    }, filter);
}
let lastMessageId = 0;
//# sourceMappingURL=RequestManager.js.map