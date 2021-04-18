import * as RequestManager from './RequestManager.js';
import { pingIntervalMS, maxPingAttempts } from './consts.js';
export const clients = new Map();
Hooks.once('ready', () => {
    RequestManager.on('ping', ({ clientId }) => {
        RequestManager.emit('pong', { target: clientId });
    });
    RequestManager.on('pong', ({ clientId, userId }) => {
        clients.set(clientId, { pingAttempts: 0, userId });
    });
    RequestManager.emit('ping');
    setInterval(() => {
        for (const clientId of clients.keys()) {
            const clientInfo = clients.get(clientId);
            if (clientInfo.pingAttempts >= maxPingAttempts) {
                clients.delete(clientId);
                continue;
            }
            clientInfo.pingAttempts++;
        }
        RequestManager.emit('ping');
    }, pingIntervalMS);
});
//# sourceMappingURL=ConnectionKeeper.js.map