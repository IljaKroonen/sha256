export const roundConstants = Object.freeze([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]);

export function rightRotate(word: number, n: number): number {
    return (word >>> n) | (word << (32 - n));
}

function safeAddInternal(a: number, b: number) {
    return (a + b) | 0;
}

export function safeAdd(...args: number[]) {
    let ret = args[0];
    for (let i = 1; i < args.length; i++) {
        ret = safeAddInternal(ret, args[i]);
    }
    return ret;
}

export function messageScheduleArray(array: number[], block: number[]): void {
    if (array.length !== 64)
        throw new Error('Parameter "array" should have a length of 64');
    if (block.length !== 16)
        throw new Error('Parameter "block" should have a length of 16');

    for (let i = 0; i < 16; i++)
        array[i] = block[i];

    for (let i = 16; i < 64; i++) {
        const s0 = rightRotate(array[i - 15], 7) ^ rightRotate(array[i - 15], 18) ^ (array[i - 15] >>> 3);
        const s1 = rightRotate(array[i - 2], 17) ^ rightRotate(array[i - 2], 19) ^ (array[i - 2] >>> 10)
        array[i] = safeAdd(array[i - 16], s0, array[i - 7], s1);
    }
}

export function uint64ToBinaryString(n: number): string {
    if (n > Math.pow(2, 48))
        throw new Error('Parameter "n" should be smaller than ' + Math.pow(2, 48));

    const b2 = n / Math.pow(2, 40);
    const b3 = (n / Math.pow(2, 32)) & 0x000000ff;
    const b4 = (n >> 24) & 0x000000ff;
    const b5 = (n >> 16) & 0x000000ff;
    const b6 = (n >> 8) & 0x000000ff;
    const b7 = n & 0x000000ff;

    return String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(b2) + String.fromCharCode(b3) +
        String.fromCharCode(b4) + String.fromCharCode(b5) + String.fromCharCode(b6) + String.fromCharCode(b7);
}

export function zeroString(length: number): string {
    if (length === 0)
        return '';

    let cs = String.fromCharCode(0);

    while (cs.length * 2 < length)
        cs += cs;

    while (cs.length < length)
        cs += String.fromCharCode(0);

    return cs;
}

export function messageAppend(length: number): string {
    if (typeof length !== 'number')
        throw new Error('Parameter "length" should be a number');

    let append = String.fromCharCode(0x80);
    let zeroesLength = 56 - (length % 64) - 1;
    if (zeroesLength < 0)
        zeroesLength = zeroesLength + 64;

    append += zeroString(zeroesLength);
    append += uint64ToBinaryString(length * 8);
    return append;
}

export function compression(hash: number[], scheduleArray: number[]) {
    if (hash.length !== 8)
        throw new Error('Parameter "hash" should have a length of 8');
    if (scheduleArray.length !== 64)
        throw new Error('Parameter "scheduleArray" should have a length of 64');

    let a = hash[0];
    let b = hash[1];
    let c = hash[2];
    let d = hash[3];
    let e = hash[4];
    let f = hash[5];
    let g = hash[6];
    let h = hash[7];

    for (let i = 0; i < 64; i++) {
        const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ ((~e) & g);
        const temp1 = safeAdd(h, s1, ch, roundConstants[i], scheduleArray[i]);
        const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = safeAdd(s0, maj);

        h = g;
        g = f;
        f = e;
        e = safeAdd(d, temp1);
        d = c;
        c = b;
        b = a;
        a = safeAdd(temp1, temp2);
    }

    hash[0] = safeAdd(hash[0], a);
    hash[1] = safeAdd(hash[1], b);
    hash[2] = safeAdd(hash[2], c);
    hash[3] = safeAdd(hash[3], d);
    hash[4] = safeAdd(hash[4], e);
    hash[5] = safeAdd(hash[5], f);
    hash[6] = safeAdd(hash[6], g);
    hash[7] = safeAdd(hash[7], h);
}

export function stringBlockToUint32Array(str: string): number[] {
    if (str.length !== 64)
        throw new Error('Parameter "str" should have a length of 64 characters');

    const ret: number[] = new Array(str.length / 4);

    for (let i = 0; i < 16; i++) {
        const b0 = str.charCodeAt(i * 4);
        const b1 = str.charCodeAt(i * 4 + 1);
        const b2 = str.charCodeAt(i * 4 + 2);
        const b3 = str.charCodeAt(i * 4 + 3);

        const uint32 = (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
        ret[i] = uint32;
    }

    return ret;
}

function uint32ToUnprefixedHexString(uint32: number) {
    if (uint32 < 0)
        uint32 += Math.pow(2, 32);
    let r = uint32.toString(16);
    while (r.length !== 8)
        r = '0' + r;
    return r;
}

export function uint32ArrayToHexString(array: number[]) {
    return '0x' + array.map(uint32ToUnprefixedHexString).join('');
}

export class Sha256 {
    private addedLength = 0;
    private buffer = '';
    private hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
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

        return uint32ArrayToHexString(this.hash);
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