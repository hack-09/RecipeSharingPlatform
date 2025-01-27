interface Options {
    /**
     * The app entry script. This is used to run the same script as the child process.
     *
     * Defaults to `process.argv[1]`.
     */
    entryScript: string;
    /**
     * Interval to send heartbeat messages to the child process.
     *
     * Defaults to 50ms.
     */
    pollInterval: number;
    /**
     * Threshold in milliseconds to trigger an ANR event.
     *
     * Defaults to 5000ms.
     */
    anrThreshold: number;
    /**
     * Whether to capture a stack trace when the ANR event is triggered.
     *
     * Defaults to `false`.
     *
     * This uses the node debugger which enables the inspector API and opens the required ports.
     */
    captureStackTrace: boolean;
    /**
     * @deprecated Use 'init' debug option instead
     */
    debug: boolean;
}
/**
 * Returns true if the current process is an ANR child process.
 */
export declare function isAnrChildProcess(): boolean;
/**
 * **Note** This feature is still in beta so there may be breaking changes in future releases.
 *
 * Starts a child process that detects Application Not Responding (ANR) errors.
 *
 * It's important to await on the returned promise before your app code to ensure this code does not run in the ANR
 * child process.
 *
 * ```js
 * import { init, enableAnrDetection } from '@sentry/node';
 *
 * init({ dsn: "__DSN__" });
 *
 * // with ESM + Node 14+
 * await enableAnrDetection({ captureStackTrace: true });
 * runApp();
 *
 * // with CJS or Node 10+
 * enableAnrDetection({ captureStackTrace: true }).then(() => {
 *   runApp();
 * });
 * ```
 */
export declare function enableAnrDetection(options: Partial<Options>): Promise<void>;
export {};
//# sourceMappingURL=index.d.ts.map