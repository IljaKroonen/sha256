import {expect} from './expect';
import {uint64ToBinaryString, messageAppend} from '../src/message-append';

export function test() {
    const str12 = uint64ToBinaryString(12);
    const expected12 = String.fromCharCode(0) + String.fromCharCode(0) +
        String.fromCharCode(0) + String.fromCharCode(0) +
        String.fromCharCode(0) + String.fromCharCode(0) +
        String.fromCharCode(0) + String.fromCharCode(12);

    expect(str12).toBe(expected12);

    const str32699974236 = uint64ToBinaryString(32699974236);

    const expected32699974236 = String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(0x07) +
        String.fromCharCode(0x9d) + String.fromCharCode(0x12) + String.fromCharCode(0x02) + String.fromCharCode(0x5c);

    expect(str32699974236).toBe(expected32699974236);

    const append50 = messageAppend(50);
    const expectedAppend50 = String.fromCharCode(128) + String.fromCharCode(0) + String.fromCharCode(0) +
        String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(0) +
        String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(0) +
        String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(50);

    expect(append50).toBe(expectedAppend50);
}