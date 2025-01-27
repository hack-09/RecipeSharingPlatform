/**
 * A simple WebSocket client implementation copied from Rome before being modified for our use:
 * https://github.com/jeremyBanks/rome/tree/b034dd22d5f024f87c50eef2872e22b3ad48973a/packages/%40romejs/codec-websocket
 *
 * Original license:
 *
 * MIT License
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import type { Socket } from 'net';
declare class WebSocketInterface extends EventEmitter {
    private _alive;
    private _incompleteFrame;
    private _unfinishedFrame;
    private _socket;
    constructor(socket: Socket);
    end(): void;
    send(buff: string): void;
    private _sendFrame;
    private _completeFrame;
    private _addBufferToIncompleteFrame;
    private _addBuffer;
}
/**
 * Creates a WebSocket client
 */
export declare function createWebSocketClient(rawUrl: string): Promise<WebSocketInterface>;
export {};
//# sourceMappingURL=websocket.d.ts.map