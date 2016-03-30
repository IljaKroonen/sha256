import {expect} from './expect';
import {stringBlockToUint32Array} from '../src/string-block-to-uint32-array';

export function test() {
    const expected = [
        1633837924, 1633837924, 1633837924, 1633837924,
        1633837924, 1633837924, 1633837924, 1633837924,
        1633837924, 1633837924, 1633837924, 1633837924,
        1633837924, 1633837924, 1633837924, 1633837924];

    const actual = stringBlockToUint32Array('abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd');

    expect(actual.length).toBe(expected.length);

    for (let i = 0; i < expected.length; i++) {
        expect(expected[i]).toBe(actual[i]);
    }
}