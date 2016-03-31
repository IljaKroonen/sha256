import {rightRotate, safeAdd} from './operators';
import {roundConstants} from './round-constants';

export function compression(hash: number[], scheduleArray: number[]) {
    if (hash.length !== 8)
        throw new Error('Parameter "hash" should have a length of 8');
    if (scheduleArray.length !== 64)
        throw new Error('Parameter "scheduleArray" should have a length of 64');

    const workingVariables = hash.slice();

    for (let i = 0; i < 64; i++) {
        const s1 = rightRotate(workingVariables[4], 6) ^ rightRotate(workingVariables[4], 11) ^ rightRotate(workingVariables[4], 25);
        const ch = (workingVariables[4] & workingVariables[5]) ^ ((~workingVariables[4]) & workingVariables[6]);
        const temp1 = safeAdd(workingVariables[7], s1, ch, roundConstants[i], workingVariables[i]);
        const s0 = rightRotate(workingVariables[0], 2) ^ rightRotate(workingVariables[0], 13) ^ rightRotate(workingVariables[0], 22);
        const maj = (workingVariables[0] & workingVariables[1]) ^ (workingVariables[0] & workingVariables[2]) ^ (workingVariables[1] & workingVariables[2]);
        const temp2 = safeAdd(s0, maj);

        workingVariables[7] = workingVariables[6];
        workingVariables[6] = workingVariables[5];
        workingVariables[5] = workingVariables[4];
        workingVariables[4] = safeAdd(workingVariables[3], temp1);
        workingVariables[3] = workingVariables[2];
        workingVariables[2] = workingVariables[1];
        workingVariables[1] = workingVariables[0];
        workingVariables[0] = safeAdd(temp1, temp2);
    }

    hash[0] = safeAdd(hash[0], workingVariables[0]);
    hash[1] = safeAdd(hash[1], workingVariables[1]);
    hash[2] = safeAdd(hash[2], workingVariables[2]);
    hash[3] = safeAdd(hash[3], workingVariables[3]);
    hash[4] = safeAdd(hash[4], workingVariables[4]);
    hash[5] = safeAdd(hash[5], workingVariables[5]);
    hash[6] = safeAdd(hash[6], workingVariables[6]);
    hash[7] = safeAdd(hash[7], workingVariables[7]);
}