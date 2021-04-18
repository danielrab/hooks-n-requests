import { RequestManager } from './requestHandling.js';
Hooks.on('ready', () => {
    RequestManager.emit({ type: 'userReady' });
    RequestManager.on('userReady', console.log);
    RequestManager.on('pong', console.log);
    RequestManager.on('ping', () => RequestManager.emit({ type: 'pong' }));
    setInterval(() => RequestManager.emit({ type: 'ping' }), 1000);
});
//# sourceMappingURL=module.js.map