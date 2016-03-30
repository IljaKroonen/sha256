export function stringBlockToUint32Array(str: string): number[] {
    if (str.length !== 64)
        throw new Error('Parameter "str" should have a length of 64 characters');

    const ret: number[] = new Array(str.length / 4);

    for (let i = 0; i < 16; i++) {
        const b0 = str.charCodeAt(i * 4);
        const b1 = str.charCodeAt(i * 4 + 1);
        const b2 = str.charCodeAt(i * 4 + 2);
        const b3 = str.charCodeAt(i * 4 + 3);

        const uint32 = (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
        ret[i] = uint32;
    }

    return ret;
}