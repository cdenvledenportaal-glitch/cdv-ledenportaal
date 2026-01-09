"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, ...args) => {
            // Whitelist channels
            const validChannels = ['toMain'];
            if (validChannels.includes(channel)) {
                electron_1.ipcRenderer.send(channel, ...args);
            }
        },
        on: (channel, func) => {
            const validChannels = ['fromMain'];
            if (validChannels.includes(channel)) {
                // Use underscore to indicate the event parameter is intentionally unused
                electron_1.ipcRenderer.on(channel, (_event, ...args) => func(...args));
            }
        },
        removeListener: (channel, func) => {
            electron_1.ipcRenderer.removeListener(channel, func);
        },
    },
    platform: process.platform,
});
