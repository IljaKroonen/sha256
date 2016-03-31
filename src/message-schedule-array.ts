import {rightRotate, safeAdd} from './operators';

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