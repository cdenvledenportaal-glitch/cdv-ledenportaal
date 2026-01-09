"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let mainWindow = null;
// Set Content Security Policy
function setCSP() {
    electron_1.session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        const csp = [
            "default-src 'self' 'unsafe-inline' data:",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data:",
            "font-src 'self' data:",
            "connect-src 'self' http://localhost:5173 ws://localhost:5173"
        ].join('; ');
        const responseHeaders = {
            ...details.responseHeaders,
            'Content-Security-Policy': csp
        };
        callback({
            responseHeaders: responseHeaders
        });
    });
}
// In the main process (main.ts)
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path_1.default.join(__dirname, 'preload.js'),
            webSecurity: true
        },
    });
    // Load the app
    if (process.env.NODE_ENV === 'development') {
        // Set CSP via headers
        mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
            const csp = [
                "default-src 'self' 'unsafe-inline' data:",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data:",
                "font-src 'self' data:",
                "connect-src 'self' http://localhost:5173 ws://localhost:5173"
            ].join('; ');
            const responseHeaders = {
                ...details.responseHeaders,
                'Content-Security-Policy': csp
            };
            callback({ responseHeaders });
        });
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(() => {
    setCSP();
    createWindow();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
