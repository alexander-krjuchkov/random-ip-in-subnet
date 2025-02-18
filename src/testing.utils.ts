import { type RandomGenerator as LocalRandomFloatGenerator } from './types';
import {
    xoroshiro128plus,
    unsafeUniformIntDistribution,
    type RandomGenerator as PureRandomIntGenerator,
} from 'pure-rand';
import chi2gof from '@stdlib/stats-chi2gof';

// function format32bitBinary(x: number): string {
//     // https://stackoverflow.com/a/16155417
//     return (x >>> 0).toString(2).padStart(32, '0');
// }

function generateFloat64(rng: PureRandomIntGenerator) {
    const upper = unsafeUniformIntDistribution(0, (1 << 26) - 1, rng);
    const lower = unsafeUniformIntDistribution(0, (1 << 27) - 1, rng);
    return (upper * 2 ** 27 + lower) * 2 ** -53;
}

export function createRandomGenerator(seed: number): LocalRandomFloatGenerator {
    const rng = xoroshiro128plus(seed);

    return () => generateFloat64(rng);
}

export function isUniformlyDistributed(frequencies: number[]) {
    const chiSquareResult = chi2gof(
        frequencies,
        'discrete-uniform',
        0,
        frequencies.length - 1,
    );

    // console.log(frequencies);
    // console.log(chiSquareResult);

    return !chiSquareResult.rejected;
}
