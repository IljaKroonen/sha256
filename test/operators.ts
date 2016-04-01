import {safeAdd, rightRotate} from '../src/operators';
import {test} from './test';

export function run() {
    (function() {
        const actual = safeAdd(1, 3);
        const expected = 4;
        test('safeAdd should correctly compute 1 + 3').expect(actual).toBe(expected);
    })();

    (function() {
        const actual = safeAdd(Math.pow(2, 31), 1000);
        const expected = 1000 - Math.pow(2, 31);
        test('safeAdd should correctly compute overflowing 32bits addition').expect(actual).toBe(expected);
    })();

    (function() {
        const actual = rightRotate(1, 1);
        const expected = -2147483648;
        test('rightRotate should correctly rotate 1 of 1 place to the right').expect(actual).toBe(expected);
    })();

    (function() {
        const actual = rightRotate(0xffffffff, 17);
        const expected = -1;
        test('rightRotate should correctly rotate 0xffffffff of 17 places to the right').expect(actual).toBe(expected);
    })();
}