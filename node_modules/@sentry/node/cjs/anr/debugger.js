Object.defineProperty(exports, '__esModule', { value: true });

const utils = require('@sentry/utils');
const module$1 = require('../module.js');
const websocket = require('./websocket.js');

// The only messages we care about

/**
 * Wraps a websocket connection with the basic logic of the Node debugger protocol.
 * @param url The URL to connect to
 * @param onMessage A callback that will be called with each return message from the debugger
 * @returns A function that can be used to send commands to the debugger
 */
async function webSocketDebugger(
  url,
  onMessage,
) {
  let id = 0;
  const webSocket = await websocket.createWebSocketClient(url);

  webSocket.on('message', (data) => {
    const message = JSON.parse(data.toString()) ;
    onMessage(message);
  });

  return (method) => {
    webSocket.send(JSON.stringify({ id: id++, method }));
  };
}

/**
 * Captures stack traces from the Node debugger.
 * @param url The URL to connect to
 * @param callback A callback that will be called with the stack frames
 * @returns A function that triggers the debugger to pause and capture a stack trace
 */
async function captureStackTrace(url, callback) {
  const sendCommand = await webSocketDebugger(
    url,
    utils.createDebugPauseMessageHandler(cmd => sendCommand(cmd), module$1.getModuleFromFilename, callback),
  );

  return () => {
    sendCommand('Debugger.enable');
    sendCommand('Debugger.pause');
  };
}

exports.captureStackTrace = captureStackTrace;
//# sourceMappingURL=debugger.js.map
