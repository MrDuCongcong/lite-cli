/*
 * @Author: DuCongcong
 * @Description:
 * @Date: 2020-10-21 14:29:18
 * @LastEditTime: 2020-10-21 18:48:53
 */
import handle from './handle.js';

const { weekdaysShort } = require('moment');
const WebSocket = require('ws');

const initSocket = (server) => {
    const socketServer = new WebSocket.Server({ port: 8082, server });

    socketServer.on('connection', (ws) => {
        const webSocket = ws;

        webSocket.on('message', (message) => {
            const params = JSON.parse(message);
            if (params.methed === 'run') {
                handle.runProject(params.projectId, webSocket);
            } else if (params.methed === 'suspend') {
            }
        });
    });
};

export default initSocket;
