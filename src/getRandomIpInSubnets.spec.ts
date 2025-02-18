import { getRandomIpInSubnets } from './getRandomIpInSubnets';
import { createRandomGenerator, isUniformlyDistributed } from './testing.utils';
import { convertIpToNumber } from './ip.utils';
import {
    getBroadcastAddress,
    getNetworkAddress,
    parseCidrNotation,
} from './cidr.utils';

// Utility functions

function isIpWithinSubnet(ip: string, cidr: string): boolean {
    const [, prefixLength] = parseCidrNotation(cidr);
    const networkAddress = getNetworkAddress(cidr);
    const broadcastAddress = getBroadcastAddress(cidr);
    const ipNumber = convertIpToNumber(ip);

    if (prefixLength === 32) {
        // For /32 prefix, only one address is available
        return ipNumber === networkAddress;
    } else if (prefixLength === 31) {
        // For /31 prefix, two addresses are available
        return ipNumber === networkAddress || ipNumber === networkAddress + 1;
    } else {
        // Excluding network and broadcast addresses
        return ipNumber > networkAddress && ipNumber < broadcastAddress;
    }
}

/**
 * Randomized invariant testing
 *
 * These tests ensure that basic guarantees such as respecting
 * value bounds are maintained, regardless of the randomness involved.
 */
describe('Randomized invariant testing', () => {
    describe('getRandomIpInSubnets', () => {
        test('returns IP belonging to one of the subnets', () => {
            const subnets = ['198.51.100.0/24', '203.0.113.0/24'];

            const iterations = 100;
            for (let i = 0; i < iterations; i++) {
                const ip = getRandomIpInSubnets(subnets);
                const isWithinAnySubnet = subnets.some((subnet) =>
                    isIpWithinSubnet(ip, subnet),
                );
                expect(isWithinAnySubnet).toBe(true);
            }
        });
    });
});

/**
 * PRNG backward compatibility tests
 *
 * When using a specified PRNG with a fixed seed, these tests ensure
 * that the library produces precisely predictable and consistent
 * results within each major version of the library.
 * Any change in output indicates a shift in the internal order
 * of PRNG calls, breaking backward compatibility and signaling
 * the need for a major version upgrade or a planned improvements
 * revision.
 */
describe('PRNG backward compatibility tests', () => {
    describe('getRandomIpInSubnets', () => {
        test('generates the same random IP sequence for the same PRNG with the same seed', () => {
            const seed = 42;
            const subnets = ['198.51.100.0/24', '203.0.113.0/24'];
            const sequenceLength = 5;

            const expectedIpSequence = [
                '203.0.113.223',
                '198.51.100.164',
                '198.51.100.169',
                '198.51.100.251',
                '203.0.113.225',
            ];

            const random = createRandomGenerator(seed);

            const actualIpSequence = [];
            for (let i = 0; i < sequenceLength; i++) {
                const ip = getRandomIpInSubnets(subnets, random);
                actualIpSequence.push(ip);
            }
            expect(actualIpSequence).toEqual(expectedIpSequence);
        });
    });
});

/**
 * Statistical tests
 *
 * These tests analyze the statistical characteristics of the generated random results.
 */
describe('Statistical tests', () => {
    describe('getRandomIpInSubnets', () => {
        test('uniformly selects all given non-overlapping subnets', () => {
            const subnetList = [
                '192.0.2.0/24',
                '198.51.100.0/24',
                '203.0.113.0/24',
            ];
            const categoriesCount = subnetList.length;
            const sampleSize = 20_000 * categoriesCount;

            // const random = Math.random;
            const seed = 42;
            const random = createRandomGenerator(seed);

            const frequencies = new Array<number>(categoriesCount).fill(0);
            for (let i = 0; i < sampleSize; i++) {
                const ip = getRandomIpInSubnets(subnetList, random);
                const subnetIndex = subnetList.findIndex((subnet) =>
                    isIpWithinSubnet(ip, subnet),
                );
                frequencies[subnetIndex]! += 1;
            }

            const isUniform = isUniformlyDistributed(frequencies);
            expect(isUniform).toBe(true);
        });
    });
});
