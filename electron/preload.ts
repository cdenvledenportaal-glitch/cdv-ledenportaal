// @ts-nocheck
import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel: string, ...args: any[]) => {
      // Whitelist channels
      const validChannels = ['toMain'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, ...args);
      }
    },
    on: (channel: string, func: (...args: any[]) => void) => {
      const validChannels = ['fromMain'];
      if (validChannels.includes(channel)) {
        // Use underscore to indicate the event parameter is intentionally unused
        ipcRenderer.on(channel, (_event, ...args) => func(...args));
      }
    },
    removeListener: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.removeListener(channel, func);
    },
  },
  platform: process.platform,
});
