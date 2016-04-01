import {test} from './test';
import {messageScheduleArray} from '../src/message-schedule-array';
import {stringBlockToUint32Array} from '../src/string-block-to-uint32-array';

export function run() {
    (function() {
        const actual = new Array(64);
        const expected = [1633837924, 1633837924, 1633837924, 1633837924, 1633837924, 1633837924, 1633837924, 1633837924,
            1633837924, 1633837924, 1633837924, 1633837924, 1633837924, 1633837924, 1633837924, 1633837924,
            -1664926785, -1664926785, 428565745, 428565745, -35838745, -35838745, 1439485398, -1859279311,
            1503773569, 1059064609, -1328789285, -1066235469, 1758574250, 692471489, 1013049254, 1225067823,
            1297747669, -1393701456, 1491043422, 2065462741, -212853281, -2081065009, -993641845, 1831710590,
            671566688, -1382400624, 1453396922, 1098177807, -1353644483, 358614802, 1652279077, -1795223747,
            -1643439874, -1062665663, 1115449349, 1925303655, -1806868409, 1193861204, 276032441, -1896671296,
            753687837, 334136815, -1871147933, 390903710, 1968558165, -1437604575, -299525345, -120802659];
            
        const block = stringBlockToUint32Array('abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd');
        messageScheduleArray(actual, block);

        test('message schedule array should get filled correctly').expect(actual).toBe(expected);
    })();
}