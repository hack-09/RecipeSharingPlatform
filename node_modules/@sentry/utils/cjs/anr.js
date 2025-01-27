Object.defineProperty(exports, '__esModule', { value: true });

const object = require('./object.js');
const stacktrace = require('./stacktrace.js');
const nodeStackTrace = require('./node-stack-trace.js');

/**
 * A node.js watchdog timer
 * @param pollInterval The interval that we expect to get polled at
 * @param anrThreshold The threshold for when we consider ANR
 * @param callback The callback to call for ANR
 * @returns An object with `poll` and `enabled` functions {@link WatchdogReturn}
 */
function watchdogTimer(
  createTimer,
  pollInterval,
  anrThreshold,
  callback,
) {
  const timer = createTimer();
  let triggered = false;
  let enabled = true;

  setInterval(() => {
    const diffMs = timer.getTimeMs();

    if (triggered === false && diffMs > pollInterval + anrThreshold) {
      triggered = true;
      if (enabled) {
        callback();
      }
    }

    if (diffMs < pollInterval + anrThreshold) {
      triggered = false;
    }
  }, 20);

  return {
    poll: () => {
      timer.reset();
    },
    enabled: (state) => {
      enabled = state;
    },
  };
}

// types copied from inspector.d.ts

/**
 * Converts Debugger.CallFrame to Sentry StackFrame
 */
function callFrameToStackFrame(
  frame,
  url,
  getModuleFromFilename,
) {
  const filename = url ? url.replace(/^file:\/\//, '') : undefined;

  // CallFrame row/col are 0 based, whereas StackFrame are 1 based
  const colno = frame.location.columnNumber ? frame.location.columnNumber + 1 : undefined;
  const lineno = frame.location.lineNumber ? frame.location.lineNumber + 1 : undefined;

  return object.dropUndefinedKeys({
    filename,
    module: getModuleFromFilename(filename),
    function: frame.functionName || '?',
    colno,
    lineno,
    in_app: filename ? nodeStackTrace.filenameIsInApp(filename) : undefined,
  });
}

// The only messages we care about

/**
 * Creates a message handler from the v8 debugger protocol and passed stack frames to the callback when paused.
 */
function createDebugPauseMessageHandler(
  sendCommand,
  getModuleFromFilename,
  pausedStackFrames,
) {
  // Collect scriptId -> url map so we can look up the filenames later
  const scripts = new Map();

  return message => {
    if (message.method === 'Debugger.scriptParsed') {
      scripts.set(message.params.scriptId, message.params.url);
    } else if (message.method === 'Debugger.paused') {
      // copy the frames
      const callFrames = [...message.params.callFrames];
      // and resume immediately
      sendCommand('Debugger.resume');
      sendCommand('Debugger.disable');

      const stackFrames = stacktrace.stripSentryFramesAndReverse(
        callFrames.map(frame =>
          callFrameToStackFrame(frame, scripts.get(frame.location.scriptId), getModuleFromFilename),
        ),
      );

      pausedStackFrames(stackFrames);
    }
  };
}

exports.createDebugPauseMessageHandler = createDebugPauseMessageHandler;
exports.watchdogTimer = watchdogTimer;
//# sourceMappingURL=anr.js.map
