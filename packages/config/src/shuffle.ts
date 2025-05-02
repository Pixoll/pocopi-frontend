// Adapted from https://github.com/dhessler/crypto-secure-shuffle
export function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = randomIndex(array.length - 1);
        const temp = array[i]!;
        array[i] = array[j]!;
        array[j] = temp;
    }

    return array;
}

// Adapted from https://www.npmjs.com/package/random-number-csprng
function randomIndex(max: number): number {
    const { bytesNeeded, mask } = calculateParameters(max);
    const randomBytes = new Uint8Array(bytesNeeded);
    let randomValue = 0;

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
