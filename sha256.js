(function () {
    var roundConstants = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    function rightRotate(word, n) {
        return (word >>> n) | (word << (32 - n));
    }
    function safeAdd2(a, b) {
        return (a + b) | 0;
    }
    function safeAdd4(a, b, c, d) {
        return safeAdd2(a, safeAdd2(b, safeAdd2(c, d)));
    }
    function safeAdd5(a, b, c, d, e) {
        return safeAdd4(a, b, c, safeAdd2(d, e));
    }
    function messageScheduleArray(array, block) {
        for (var i = 0; i < 16; i++)
            array[i] = block[i];
        for (var i = 16; i < 64; i++) {
            var s0 = rightRotate(array[i - 15], 7) ^ rightRotate(array[i - 15], 18) ^ (array[i - 15] >>> 3);
            var s1 = rightRotate(array[i - 2], 17) ^ rightRotate(array[i - 2], 19) ^ (array[i - 2] >>> 10);
            array[i] = safeAdd4(array[i - 16], s0, array[i - 7], s1);
        }
    }
    function uint64ToBinaryString(n) {
        var b2 = n / Math.pow(2, 40);
        var b3 = (n / Math.pow(2, 32)) & 0x000000ff;
        var b4 = (n >> 24) & 0x000000ff;
        var b5 = (n >> 16) & 0x000000ff;
        var b6 = (n >> 8) & 0x000000ff;
        var b7 = n & 0x000000ff;
        return String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(b2) + String.fromCharCode(b3) +
            String.fromCharCode(b4) + String.fromCharCode(b5) + String.fromCharCode(b6) + String.fromCharCode(b7);
    }
    function zeroString(length) {
        if (length === 0)
            return '';
        var cs = String.fromCharCode(0);
        while (cs.length * 2 < length)
            cs += cs;
        while (cs.length < length)
            cs += String.fromCharCode(0);
        return cs;
    }
    function messageAppend(length) {
        var append = String.fromCharCode(0x80);
        var zeroesLength = 56 - (length % 64) - 1;
        if (zeroesLength < 0)
            zeroesLength = zeroesLength + 64;
        append += zeroString(zeroesLength);
        append += uint64ToBinaryString(length * 8);
        return append;
    }
    function compression(hash, scheduleArray) {
        var a = hash[0];
        var b = hash[1];
        var c = hash[2];
        var d = hash[3];
        var e = hash[4];
        var f = hash[5];
        var g = hash[6];
        var h = hash[7];
        for (var i = 0; i < 64; i++) {
            var s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
            var ch = (e & f) ^ ((~e) & g);
            var temp1 = safeAdd5(h, s1, ch, roundConstants[i], scheduleArray[i]);
            var s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
            var maj = (a & b) ^ (a & c) ^ (b & c);
            var temp2 = safeAdd2(s0, maj);
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
    function stringBlockToUint32Array(str) {
        var ret = new Array(str.length / 4);
        for (var i = 0; i < 16; i++) {
            var b0 = str.charCodeAt(i * 4);
            var b1 = str.charCodeAt(i * 4 + 1);
            var b2 = str.charCodeAt(i * 4 + 2);
            var b3 = str.charCodeAt(i * 4 + 3);
            var uint32 = (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
            ret[i] = uint32;
        }
        return ret;
    }
    function uint32ToUnprefixedHexString(uint32) {
        if (uint32 < 0)
            uint32 += Math.pow(2, 32);
        var r = uint32.toString(16);
        while (r.length !== 8)
            r = '0' + r;
        return r;
    }
    function uint32ArrayToHexString(array) {
        return '0x' + array.map(uint32ToUnprefixedHexString).join('');
    }
    var Sha256 = (function () {
        function Sha256(length) {
            this.length = length;
            this.addedLength = 0;
            this.buffer = '';
            this.hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
            this.scheduleArray = new Array(64);
        }
        Sha256.prototype.add = function (part) {
            this.addedLength += part.length;
            this.addInternal(part);
            if (this.addedLength === this.length) {
                var lastPart = messageAppend(this.length);
                this.addInternal(lastPart);
            }
        };
        Sha256.prototype.get = function () {
            return uint32ArrayToHexString(this.hash);
        };
        Sha256.prototype.addInternal = function (part) {
            while (part !== '') {
                var required = 64 - this.buffer.length;
                this.buffer += part.slice(0, required);
                part = part.slice(required);
                if (this.buffer.length === 64) {
                    this.processBlock(this.buffer);
                    this.buffer = '';
                }
            }
        };
        Sha256.prototype.processBlock = function (strBlock) {
            var block = stringBlockToUint32Array(strBlock);
            messageScheduleArray(this.scheduleArray, block);
            compression(this.hash, this.scheduleArray);
        };
        return Sha256;
    }());
    function sha256(input, callback) {
        if (typeof input === 'string') {
            var o = new Sha256(input.length);
            o.add(input);
            callback(o.get());
        }
        else if (input instanceof Blob) {
            var o_1 = new Sha256(input.size);
            var fr_1 = new FileReader();
            var pos_1 = 0;
            fr_1.addEventListener('load', function () {
                console.log(pos_1);
                o_1.add(fr_1.result);
                if (pos_1 > input.size)
                    callback(o_1.get());
                else {
                    var blob_1 = input.slice(pos_1, 1024 * 1024);
                    pos_1 += 1024 * 1024;
                    fr_1.readAsBinaryString(blob_1);
                }
            });
            var blob = input.slice(pos_1, 1024 * 1024);
            pos_1 += 1024 * 1024;
            fr_1.readAsBinaryString(blob);
        }
        else {
            throw new Error('Input type not supported');
        }
    }
    window['sha256'] = sha256;
})();
