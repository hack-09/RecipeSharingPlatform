import type { Client, Event, EventHint, Integration } from '@sentry/types';
/** Options for the InboundFilters integration */
export interface InboundFiltersOptions {
    allowUrls: Array<string | RegExp>;
    denyUrls: Array<string | RegExp>;
    ignoreErrors: Array<string | RegExp>;
    ignoreTransactions: Array<string | RegExp>;
    ignoreInternal: boolean;
    disableErrorDefaults: boolean;
    disableTransactionDefaults: boolean;
}
/** Inbound filters configurable by the user */
export declare class InboundFilters implements Integration {
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    name: string;
    private readonly _options;
    constructor(options?: Partial<InboundFiltersOptions>);
    /**
     * @inheritDoc
     */
    setupOnce(_addGlobaleventProcessor: unknown, _getCurrentHub: unknown): void;
    /** @inheritDoc */
    processEvent(event: Event, _eventHint: EventHint, client: Client): Event | null;
}
/** JSDoc */
export declare function _mergeOptions(internalOptions?: Partial<InboundFiltersOptions>, clientOptions?: Partial<InboundFiltersOptions>): Partial<InboundFiltersOptions>;
/** JSDoc */
export declare function _shouldDropEvent(event: Event, options: Partial<InboundFiltersOptions>): boolean;
//# sourceMappingURL=inboundfilters.d.ts.map