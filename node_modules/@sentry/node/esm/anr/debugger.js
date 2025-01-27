import { createDebugPauseMessageHandler } from '@sentry/utils';
import { getModuleFromFilename } from '../module.js';
import { createWebSocketClient } from './websocket.js';

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
  const webSocket = await createWebSocketClient(url);

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
    createDebugPauseMessageHandler(cmd => sendCommand(cmd), getModuleFromFilename, callback),
  );

  return () => {
    sendCommand('Debugger.enable');
    sendCommand('Debugger.pause');
  };
}

export { captureStackTrace };
//# sourceMappingURL=debugger.js.map
