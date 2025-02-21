import { getRandomIPv4FromSubnetList } from './getRandomIPv4FromSubnetList';
import { createRandomGenerator, isUniformlyDistributed } from './testing.utils';
import { IPv4Network } from './IPv4Network';
import { IPv4Address } from './IPv4Address';
import { EmptySubnetListError } from './errors/EmptySubnetListError';

function isIpWithinSubnet(ipAddress: string, cidrNotation: string): boolean {
    const network = IPv4Network.fromString(cidrNotation);
    const ip = IPv4Address.fromString(ipAddress);

    if (network.prefixLength === 32) {
        // For /32 prefix, only one address is available
        return ip.number === network.networkAddress.number;
    }

    if (network.prefixLength === 31) {
        // For /31 prefix, two addresses are available
        return (
            ip.number === network.networkAddress.number ||
            ip.number === (network.networkAddress.number | 1) >>> 0
        );
    }

    // Excluding network and broadcast addresses
    return (
        ip.number > network.networkAddress.number &&
        ip.number < network.broadcastAddress.number
    );
}

/**
 * Randomized invariant testing
 *
 * These tests ensure that basic guarantees such as respecting
 * value bounds are maintained, regardless of the randomness involved.
 */
describe('Randomized invariant testing', () => {
    describe('getRandomIPv4FromSubnetList', () => {
        test('returns IP belonging to one of the subnets', () => {
            const subnets = ['198.51.100.0/24', '203.0.113.0/24'];

            const iterations = 100;
            for (let i = 0; i < iterations; i++) {
                const ip = getRandomIPv4FromSubnetList(subnets);
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
    describe('getRandomIPv4FromSubnetList', () => {
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
                const ip = getRandomIPv4FromSubnetList(subnets, random);
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
    describe('getRandomIPv4FromSubnetList', () => {
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
                const ip = getRandomIPv4FromSubnetList(subnetList, random);
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

describe('Special cases', () => {
    describe('getRandomIPv4InSubnet', () => {
        test('throws error for empty subnet list', () => {
            expect(() => getRandomIPv4FromSubnetList([])).toThrow(
                EmptySubnetListError,
            );
        });
    });
});
