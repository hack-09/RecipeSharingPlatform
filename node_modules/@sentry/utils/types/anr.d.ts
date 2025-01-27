import type { StackFrame } from '@sentry/types';
type WatchdogReturn = {
    /** Resets the watchdog timer */
    poll: () => void;
    /** Enables or disables the watchdog timer */
    enabled: (state: boolean) => void;
};
type CreateTimerImpl = () => {
    getTimeMs: () => number;
    reset: () => void;
};
/**
 * A node.js watchdog timer
 * @param pollInterval The interval that we expect to get polled at
 * @param anrThreshold The threshold for when we consider ANR
 * @param callback The callback to call for ANR
 * @returns An object with `poll` and `enabled` functions {@link WatchdogReturn}
 */
export declare function watchdogTimer(createTimer: CreateTimerImpl, pollInterval: number, anrThreshold: number, callback: () => void): WatchdogReturn;
interface Location {
    scriptId: string;
    lineNumber: number;
    columnNumber?: number;
}
interface CallFrame {
    functionName: string;
    location: Location;
    url: string;
}
interface ScriptParsedEventDataType {
    scriptId: string;
    url: string;
}
interface PausedEventDataType {
    callFrames: CallFrame[];
    reason: string;
}
type DebugMessage = {
    method: 'Debugger.scriptParsed';
    params: ScriptParsedEventDataType;
} | {
    method: 'Debugger.paused';
    params: PausedEventDataType;
};
/**
 * Creates a message handler from the v8 debugger protocol and passed stack frames to the callback when paused.
 */
export declare function createDebugPauseMessageHandler(sendCommand: (message: string) => void, getModuleFromFilename: (filename?: string) => string | undefined, pausedStackFrames: (frames: StackFrame[]) => void): (message: DebugMessage) => void;
export {};
//# sourceMappingURL=anr.d.ts.map