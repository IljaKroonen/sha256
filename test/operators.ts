import {safeAdd, rightRotate} from '../src/operators';
import {expect} from './expect';

export function test() {
    (function() {
        const actual = safeAdd(1, 3);
        const expected = 4;
        expect(actual).toBe(expected);
    })();
    
    (function() {
        const actual = safeAdd(Math.pow(2, 31), 1000);
        const expected = 1000 - Math.pow(2, 31);
        expect(actual).toBe(expected);
    })();
    
    (function() {
        const actual = rightRotate(1, 1);
        const expected = -2147483648;
        expect(actual).toBe(expected);
    })();
    
    (function() {
        const actual = rightRotate(0xffffffff, 17);
        const expected = -1;
        expect(actual).toBe(expected);
    })();
}