import {Sha256} from '../src/sha256';
import {test} from './test';

export function run() {
    (function() {
        const sha256 = new Sha256(0);
        sha256.add('');
        const actual = sha256.get();
        const expected = '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
        test('Digest for empty string must be correct').expect(actual).toBe(expected);
    })();
    
    (function() {
        const sha256 = new Sha256(4);
        sha256.add('derp');
        const actual = sha256.get();
        const expected = '0x3f4146a1d0b5dac26562ff7dc6248573f4e996cf764a0f517318ff398dcfa792';
        test('Digest for message "derp" must be correct').expect(actual).toBe(expected);
    })();
}