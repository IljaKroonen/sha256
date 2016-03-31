import {expect} from './expect';
import {uint32ArrayToHexString} from '../src/uint32-array-to-hex-string';

export function test() {
    (function() {
        const actual = uint32ArrayToHexString([0, 0, 0, 0, 0, 0, 0, 0]);
        const expected = '0x0000000000000000000000000000000000000000000000000000000000000000';

        expect(actual).toBe(expected);
    })();

    (function() {
        const actual = uint32ArrayToHexString([(Math.pow(2, 31) + 1000) | 0, 3643, 0, 1337, 1000000000, 999999999, 1, -1]);
        const expected = '0x800003e800000e3b00000000000005393b9aca003b9ac9ff00000001ffffffff';

        expect(actual).toBe(expected);
    })();
}