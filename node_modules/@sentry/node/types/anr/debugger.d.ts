import type { StackFrame } from '@sentry/types';
/**
 * Captures stack traces from the Node debugger.
 * @param url The URL to connect to
 * @param callback A callback that will be called with the stack frames
 * @returns A function that triggers the debugger to pause and capture a stack trace
 */
export declare function captureStackTrace(url: string, callback: (frames: StackFrame[]) => void): Promise<() => void>;
//# sourceMappingURL=debugger.d.ts.map