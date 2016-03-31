export function uint32ArrayToHexString(array: number[]) {
    return '0x' + array.map(n => Math.abs(n).toString(16)).join('');
}

