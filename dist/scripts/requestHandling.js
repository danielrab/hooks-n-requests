import { moduleName } from './consts.js';
let lastMessageId = 0;
export class RequestManager {
    static emit({ type, data, target }) {
        lastMessageId++;
        const message = { type, socketId: game.socket.id, data, messageId: lastMessageId, target };
        game.socket.emit(`module.${moduleName}`, message);
    }
    static on(type, callback, filter) {
        return game.socket.on(`module.${moduleName}`, (message, userId) => {
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
        });
    }
}
//# sourceMappingURL=requestHandling.js.map