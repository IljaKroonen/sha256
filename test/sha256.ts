import {Sha256} from '../src/sha256';
import {expect} from './expect';

export function test() {
    (function() {
        const sha256 = new Sha256(4);
        sha256.add('derp');
        const actual = sha256.get();
        const expected = '3f4146a1d0b5dac26562ff7dc6248573f4e996cf764a0f517318ff398dcfa792';
        expect(actual).toBe(expected);
    })();
}