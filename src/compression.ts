import {rightRotate, safeAdd} from './operators';
import {roundConstants} from './round-constants';

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