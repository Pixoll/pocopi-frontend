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
export declare function shuffle<T>(array: T[]): T[];
