export function expect(actual: any) {
    return {
        toBe: function(expected: any) {
            if (actual === expected)
                return;

            if (JSON.stringify(actual) === JSON.stringify(expected))
                return;

            throw new Error('actual ' + JSON.stringify(actual) + ' is not equal to ' + JSON.stringify(expected));
        }
    };
}