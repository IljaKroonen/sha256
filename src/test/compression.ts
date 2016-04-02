import {compression, roundConstants, messageScheduleArray, uint32ArrayToHexString} from '../main/sha256';
import {test} from './test';

export function run() {
    (function() {
        const initial = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

        const scheduleArray = new Array(64);
        messageScheduleArray(scheduleArray, [1684370032, -2147483648, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4]);

        const actual = initial.slice();
        const expected = [715150309, -2123362615, 869146944, 10120110,
            1215547630, 2053012418, 2006774517, -2062002281]

        compression(actual, scheduleArray);

        test('compression function should modify hash array').expect(actual).notToBe(initial);

        test('compression function should return expected result').expect(actual).toBe(expected);


    })();
}