import {Sha256} from '../src/sha256';

export function test() {
    const sha256 = new Sha256(4);
    sha256.add('derp');
    console.log(sha256.get());
}