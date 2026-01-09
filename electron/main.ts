import { app, BrowserWindow, session } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

// Set Content Security Policy
function setCSP() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
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
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
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
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  setCSP();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});