/**
 * Adapted from https://github.com/dhessler/crypto-secure-shuffle
 *
 * Shuffles an array using a cryptographically secure random number generator. Implements the Fisher-Yates (Knuth)
 * shuffle algorithm with secure random values. This function modifies the original array and returns it.
 *
 * @param array - The array to shuffle
 *
 * @returns The shuffled array (same reference as input)
 */
export function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = randomIndex(array.length - 1);
        const temp = array[i]!;
        array[i] = array[j]!;
        array[j] = temp;
    }

    return array;
}

/**
 * Adapted from https://www.npmjs.com/package/random-number-csprng
 *
 * Generates a cryptographically secure random integer between 0 and max (inclusive). Uses Web Crypto API to generate
 * secure random values with uniform distribution.
 *
 * @param max - The maximum value (inclusive) for the random number
 *
 * @returns A random integer between 0 and max (inclusive)
 */
function randomIndex(max: number): number {
    const { bytesNeeded, mask } = calculateParameters(max);
    const randomBytes = new Uint8Array(bytesNeeded);
    let randomValue = max + 1;

    while (randomValue > max) {
        randomValue = 0;
        crypto.getRandomValues(randomBytes);

        for (let i = 0; i < bytesNeeded; i++) {
            randomValue |= (randomBytes[i]! << (8 * i));
        }

        randomValue &= mask;
    }

    return randomValue;
}

/**
 * Calculates the number of bytes required and creates a bitmask for the desired range.
 *
 * @param range - The upper limit of the range
 *
 * @returns Object containing bytesNeeded and mask parameters
 */
function calculateParameters(range: number): {
    bytesNeeded: number;
    mask: number;
} {
    let bitsNeeded = 0;
    let bytesNeeded = 0;
    let mask = 1;

    while (range > 0) {
        if (bitsNeeded % 8 === 0) {
            bytesNeeded += 1;
        }

        bitsNeeded += 1;
        mask = mask << 1 | 1;

        range >>>= 1;
    }

    return { bytesNeeded, mask };
}
