import {compression} from '../src/compression';
import {expect} from './expect';

export function test() {
    (function() {
        const scheduleArray = [];
        for (let i = 0; i < 64; i++)
            scheduleArray.push(i);

        const hash = [0, 0, 0, 0, 0, 0, 0, 0];
        const expected = [0, 0, 0, 0, 0, 0, 0, 0];
        compression(hash, scheduleArray);
        expect(hash).toBe(expected);
    })();
}