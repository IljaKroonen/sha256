import {compression} from '../src/compression';
import {test} from './test';
import {roundConstants} from '../src/round-constants';
import {messageScheduleArray} from '../src/message-schedule-array';
import {initialHash} from '../src/initial-hash';
import {uint32ArrayToHexString} from '../src/uint32-array-to-hex-string';

export function run() {
    (function() {
        const initial = initialHash();

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