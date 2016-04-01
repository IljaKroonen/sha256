export function uint64ToBinaryString(n: number): string {
    if (n > Math.pow(2, 48))
        throw new Error('Parameter "n" should be smaller than ' + Math.pow(2, 48));

    const b2 = n / Math.pow(2, 40);
    const b3 = (n / Math.pow(2, 32)) & 0x000000ff;
    const b4 = (n >> 24) & 0x000000ff;
    const b5 = (n >> 16) & 0x000000ff;
    const b6 = (n >> 8) & 0x000000ff;
    const b7 = n & 0x000000ff;

    return String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(b2) + String.fromCharCode(b3) +
        String.fromCharCode(b4) + String.fromCharCode(b5) + String.fromCharCode(b6) + String.fromCharCode(b7);
}

export function zeroString(length: number): string {
    if (length === 0)
        return '';

    let cs = String.fromCharCode(0);

    while (cs.length * 2 < length)
        cs += cs;

    while (cs.length < length)
        cs += String.fromCharCode(0);

    return cs;
}

export function messageAppend(length: number): string {
    if (typeof length !== 'number')
        throw new Error('Parameter "length" should be a number');

    let append = String.fromCharCode(0x80);
    let zeroesLength = 56 - (length % 64) - 1;
    if (zeroesLength < 0)
        zeroesLength = zeroesLength + 64;

    append += zeroString(zeroesLength);
    append += uint64ToBinaryString(length * 8);
    return append;
}