(function() {
    function uint8ArrayConcat2(a: Uint8Array, b: Uint8Array) {
        const ret = new Uint8Array(a.length + b.length);
        ret.set(a, 0);
        ret.set(b, a.length);
        return ret;
    }

    function uint8ArrayConcat3(a: Uint8Array, b: Uint8Array, c: Uint8Array) {
        const ret = new Uint8Array(a.length + b.length + c.length);
        ret.set(a, 0);
        ret.set(b, a.length);
        ret.set(c, a.length + b.length);
        return ret;
    }

    const roundConstants = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

    function rightRotate(word: number, n: number): number {
        return (word >>> n) | (word << (32 - n));
    }

    function safeAdd2(a: number, b: number) {
        return (a + b) | 0;
    }

    function safeAdd4(a: number, b: number, c: number, d: number) {
        return safeAdd2(a, safeAdd2(b, safeAdd2(c, d)));
    }

    function safeAdd5(a: number, b: number, c: number, d: number, e: number) {
        return safeAdd4(a, b, c, safeAdd2(d, e));
    }


    function messageScheduleArray(array: Uint32Array, block: Uint8Array, offset: number): void {
        for (let i = 0; i < 16; i++)
            array[i] = (block[offset + i * 4] << 24) | (block[offset + i * 4 + 1] << 16) | (block[offset + i * 4 + 2] << 8) | block[offset + i * 4 + 3];

        for (let i = 16; i < 64; i++) {
            const s0 = rightRotate(array[i - 15], 7) ^ rightRotate(array[i - 15], 18) ^ (array[i - 15] >>> 3);
            const s1 = rightRotate(array[i - 2], 17) ^ rightRotate(array[i - 2], 19) ^ (array[i - 2] >>> 10)
            array[i] = safeAdd4(array[i - 16], s0, array[i - 7], s1);
        }
    }

    function uint64ToUint8Array(n: number): Uint8Array {
        const b2 = n / Math.pow(2, 40);
        const b3 = (n / Math.pow(2, 32)) & 0x000000ff;
        const b4 = (n >> 24) & 0x000000ff;
        const b5 = (n >> 16) & 0x000000ff;
        const b6 = (n >> 8) & 0x000000ff;
        const b7 = n & 0x000000ff;

        return new Uint8Array([0, 0, b2, b3, b4, b5, b6, b7]);
    }

    function messageAppend(length: number): Uint8Array {
        let zeroesLength = 56 - (length % 64) - 1;
        if (zeroesLength < 0)
            zeroesLength = zeroesLength + 64;

        return uint8ArrayConcat3(new Uint8Array([0x80]), new Uint8Array(zeroesLength), uint64ToUint8Array(length * 8));
    }

    function compression(hash: Uint32Array, scheduleArray: Uint32Array) {
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
            const temp1 = safeAdd5(h, s1, ch, roundConstants[i], scheduleArray[i]);
            const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = safeAdd2(s0, maj);

            h = g;
            g = f;
            f = e;
            e = safeAdd2(d, temp1);
            d = c;
            c = b;
            b = a;
            a = safeAdd2(temp1, temp2);
        }

        hash[0] = safeAdd2(hash[0], a);
        hash[1] = safeAdd2(hash[1], b);
        hash[2] = safeAdd2(hash[2], c);
        hash[3] = safeAdd2(hash[3], d);
        hash[4] = safeAdd2(hash[4], e);
        hash[5] = safeAdd2(hash[5], f);
        hash[6] = safeAdd2(hash[6], g);
        hash[7] = safeAdd2(hash[7], h);
    }

    function uint32ToUnprefixedHexString(uint32: number) {
        if (uint32 < 0)
            uint32 += Math.pow(2, 32);
        let r = uint32.toString(16);
        while (r.length !== 8)
            r = '0' + r;
        return r;
    }

    function uint32ArrayToHexString(array: Uint32Array) {
        return '0x' + Array.prototype.slice.call(array).map(uint32ToUnprefixedHexString).join('');
    }

    class Sha256 {
        private addedLength: number;
        private incompleteBlock: Uint8Array;
        private hash: Uint32Array;
        private scheduleArray: Uint32Array;
        private length: number;

        constructor(length: number) {
            this.addedLength = 0;
            this.incompleteBlock = new Uint8Array(0);
            this.hash = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
            this.scheduleArray = new Uint32Array(64);
            this.length = length;
        }

        add(part: Uint8Array): void {
            this.addedLength += part.length;

            this.addInternal(part);

            if (this.addedLength === this.length) {
                const lastPart = messageAppend(this.length);
                this.addInternal(lastPart);
            }
        }

        get(): string {
            return uint32ArrayToHexString(this.hash);
        }

        private addInternal(part: Uint8Array) {
            let index = 0;

            if (this.incompleteBlock.length > 0) {
                const step = 64 - this.incompleteBlock.length;
                index += step;
                this.incompleteBlock = uint8ArrayConcat2(this.incompleteBlock, part.slice(0, step));
                if (this.incompleteBlock.length === 64) {
                    this.processBlock(this.incompleteBlock, 0);
                    this.incompleteBlock = new Uint8Array(0);
                }
            }

            while (index + 64 <= part.length) {
                this.processBlock(part, index);
                index += 64;
            }

            this.incompleteBlock = part.slice(index);
        }

        private processBlock(block: Uint8Array, offset: number) {
            messageScheduleArray(this.scheduleArray, block, offset);
            compression(this.hash, this.scheduleArray);
        }
    }

    const stepSize = 1024 * 1024;

    function sha256(input: string | Blob, callback: (hash: string) => any, progress: (percent: number) => any) {
        if (!progress)
            progress = () => { };

        if (typeof input === 'string') {
            throw 'not implemented for string';
            /*const o = new Sha256(input.length);
            o.add(input);
            callback(o.get());*/
        } else if (input instanceof Blob) {
            const o = new Sha256(input.size);
            const fr = new FileReader();
            let pos = 0;
            fr.addEventListener('load', () => {
                o.add(new Uint8Array(fr.result));
                progress(100 * pos / input.size);
                if (pos > input.size)
                    callback(o.get());
                else {
                    const blob = input.slice(pos, pos + stepSize);
                    pos += stepSize;
                    fr.readAsArrayBuffer(blob);
                }
            });
            const blob = input.slice(pos, pos + stepSize);
            pos += stepSize;
            fr.readAsArrayBuffer(blob);
        } else {
            throw new Error('Input type not supported');
        }
    }

    window['sha256'] = sha256;
})();