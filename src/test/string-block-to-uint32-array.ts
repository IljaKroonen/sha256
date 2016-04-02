import {test} from './test';
import {stringBlockToUint32Array} from '../main/sha256';

export function run() {
    const expected = [
        1633837924, 1633837924, 1633837924, 1633837924,
        1633837924, 1633837924, 1633837924, 1633837924,
        1633837924, 1633837924, 1633837924, 1633837924,
        1633837924, 1633837924, 1633837924, 1633837924];

    const actual = stringBlockToUint32Array('abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd');

    test('stringBlockToUint32Array must return an array of the correct length').expect(actual.length).toBe(expected.length);

    test('stringBlockToUint32Array must return the correct array').expect(expected).toBe(actual);
}