export function rightRotate(word: number, n: number): number {
    return (word >>> n) | (word << (32 - n));
}

function safeAddInternal(a: number, b: number) {
    return (a + b) | 0;
}

export function safeAdd(...args: number[]) {
    let ret = args[0];
    for (let i = 1; i < args.length; i++) {
        ret = safeAddInternal(ret, args[i]);
    }
    return ret;
}