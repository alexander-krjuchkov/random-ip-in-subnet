/**
 * @returns a random number greater than or equal to 0 and less than 1.
 * Should return a floating-point, pseudo-random number
 * that is greater than or equal to 0 and less than 1,
 * with approximately uniform distribution over that range.
 * This function does not have to provide cryptographically secure random numbers.
 */
export type RandomGenerator = () => number;
