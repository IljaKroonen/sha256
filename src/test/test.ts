export function test(description: string) {
    return {
        expect: function(actual: any) {
            return {
                toBe: function(expected: any) {
                    if (actual === expected)
                        return console.log('PASS: ' + description);

                    if (JSON.stringify(actual) === JSON.stringify(expected))
                        return console.log('PASS: ' + description);

                    throw new Error('TEST FAILED: ' + description + ': actual ' + JSON.stringify(actual) + ' is not equal to ' + JSON.stringify(expected));
                },
                notToBe: function(notExpected: any) {
                    if (actual === notExpected)
                        throw new Error('TEST FAILED: ' + description + ': actual ' + JSON.stringify(actual) + ' is equal to ' + JSON.stringify(notExpected));

                    if (JSON.stringify(actual) === JSON.stringify(notExpected))
                        throw new Error('TEST FAILED: ' + description + ': actual ' + JSON.stringify(actual) + ' is equal to ' + JSON.stringify(notExpected));

                    console.log('PASS: ' + description);
                }
            };
        }
    }
}