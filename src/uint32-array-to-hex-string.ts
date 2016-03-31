function uint32ToUnprefixedHexString(uint32: number) {
    if (uint32 < 0)
        uint32 += Math.pow(2, 32);
    let r = uint32.toString(16);
    while (r.length !== 8)
        r = '0' + r;
    return r;
}

export function uint32ArrayToHexString(array: number[]) {
    return '0x' + array.map(uint32ToUnprefixedHexString).join('');
}

