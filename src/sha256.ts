import {initialHash} from './initial-hash';
import {messageScheduleArray} from './message-schedule-array';
import {stringBlockToUint32Array} from './string-block-to-uint32-array';
import {compression} from './compression';
import {messageAppend} from './message-append';

export class Sha256 {
    private addedLength = 0;
    private buffer = '';
    private hash = initialHash();
    private scheduleArray = new Array(64);

    constructor(private length: number) { }

    add(part: string): void {
        this.addedLength += part.length;
        if (this.addedLength > this.length)
            throw new Error('Length of message exceeded');

        this.addInternal(part);

        if (this.addedLength === this.length) {
            const lastPart = messageAppend(this.length);
            this.addInternal(lastPart);
        }
    }

    get(): string {
        if (this.addedLength < this.length)
            throw new Error('Not all parts of message have been added');
        if (this.addedLength > this.length)
            throw new Error('Cannot get hash value because too many bytes have been added');

        return JSON.stringify(this.hash);
    }

    private addInternal(part: string) {
        while (part !== '') {
            const required = 64 - this.buffer.length;
            this.buffer += part.slice(0, required);
            part = part.slice(required);

            if (this.buffer.length === 64) {
                this.processBlock(this.buffer);
                this.buffer = '';
            }
        }
    }

    private processBlock(strBlock: string) {
        const block = stringBlockToUint32Array(strBlock);
        messageScheduleArray(this.scheduleArray, block);
        compression(this.hash, this.scheduleArray);
    }
}