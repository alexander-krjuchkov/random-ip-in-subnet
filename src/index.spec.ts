import {
    getRandomIpInSubnet,
    getRandomIpInSubnets,
    type RandomGenerator as LocalRandomFloatGenerator,
} from './index';
import {
    xoroshiro128plus,
    unsafeUniformIntDistribution,
    type RandomGenerator as PureRandomIntGenerator,
} from 'pure-rand';
import { isUniformlyDistributed } from './stat-testing.utils';

// Utility functions

function convertIpToNumber(ip: string): number {
    const ipParts = ip.split('.').map(Number) as [
        number,
        number,
        number,
        number,
    ];

    if (
        ipParts.length !== 4 ||
        ipParts.some((part) => part < 0 || part > 255)
    ) {
        throw new Error('Invalid IP address');
    }

    const ipNumber =
        (ipParts[0] << 24) |
        (ipParts[1] << 16) |
        (ipParts[2] << 8) |
        ipParts[3];

    return ipNumber >>> 0;
}

// function convertNumberToIp(number: number): string {
//     // https://stackoverflow.com/a/8105740
//     const octets = [
//         (number >>> 24) & 255,
//         (number >>> 16) & 255,
//         (number >>> 8) & 255,
//         number & 255,
//     ];

//     return octets.join('.');
// }

// function format32bitBinary(x: number): string {
//     // https://stackoverflow.com/a/16155417
//     return (x >>> 0).toString(2).padStart(32, '0');
// }

function getNetworkMask(prefix: number): number {
    if (prefix < 0 || prefix > 32) {
        throw new Error('Invalid prefix length');
    }

    // Prefix specifies the number of leading bits set to one, followed by zeros
    /** @todo: implement only on binary numbers without using intermediate string */
    return parseInt('1'.repeat(prefix) + '0'.repeat(32 - prefix), 2);
}

function parseCidrNotation(cidr: string): [number, number] {
    const parts = cidr.split('/');
    if (
        parts.length !== 2 ||
        parts[0] === undefined ||
        parts[1] === undefined
    ) {
        throw new Error('Invalid CIDR notation');
    }

    const ipNumber = convertIpToNumber(parts[0]);

    const prefixLength = parseInt(parts[1], 10);
    if (isNaN(prefixLength)) {
        throw new Error('Invalid prefix length');
    }

    return [ipNumber, prefixLength];
}

function getNetworkAddress(cidr: string): number {
    const [ipNumber, prefixLength] = parseCidrNotation(cidr);

    const networkMask = getNetworkMask(prefixLength);
    return (ipNumber & networkMask) >>> 0;
}

function getBroadcastAddress(cidr: string): number {
    const [ipNumber, prefixLength] = parseCidrNotation(cidr);

    const networkMask = getNetworkMask(prefixLength);
    return (ipNumber | ~networkMask) >>> 0;
}

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

function extractLastBitsFromIp(ip: string, bitsCount: number): number {
    return convertIpToNumber(ip) & ((1 << bitsCount) - 1);
}

function generateFloat64(rng: PureRandomIntGenerator) {
    const upper = unsafeUniformIntDistribution(0, (1 << 26) - 1, rng);
    const lower = unsafeUniformIntDistribution(0, (1 << 27) - 1, rng);
    return (upper * 2 ** 27 + lower) * 2 ** -53;
}

function createRandomGenerator(seed: number): LocalRandomFloatGenerator {
    const rng = xoroshiro128plus(seed);

    return () => generateFloat64(rng);
}

/**
 * Invariant testing
 *
 * These tests ensure that basic guarantees such as respecting
 * value bounds are maintained, regardless of the randomness involved.
 */
describe('Invariant testing', () => {
    describe('getRandomIpInSubnet', () => {
        describe('for /32 prefix', () => {
            test('returns the specified IP', () => {
                const iterations = 100;
                for (let i = 0; i < iterations; i++) {
                    const inputIp = Array.from({ length: 4 })
                        .map(() => Math.floor(Math.random() * 256))
                        .join('.');
                    const cidr = `${inputIp}/32`;

                    const outputIp = getRandomIpInSubnet(cidr);
                    expect(outputIp).toBe(inputIp);
                }
            });
        });

        describe('for /31 prefix', () => {
            test('returns one of two possible IPs', () => {
                // 192.0.2.72 - 0b11000000_00000000_00000010_01001000
                // 192.0.2.73 - 0b11000000_00000000_00000010_01001001
                const cidr = '192.0.2.72/31';
                const validIps = ['192.0.2.72', '192.0.2.73'];

                const iterations = 100;
                for (let i = 0; i < iterations; i++) {
                    const outputIp = getRandomIpInSubnet(cidr);
                    expect(validIps).toContain(outputIp);
                }
            });
        });

        describe.each([
            [0, '0.0.0.0/0'],
            [4, '240.0.0.0/4'],
            [24, '192.0.2.0/24'],
        ])('for /%d prefix', (prefix, cidr) => {
            test('returns IP between network and broadcast addresses', () => {
                const networkAddress = getNetworkAddress(cidr);
                const broadcastAddress = getBroadcastAddress(cidr);

                const iterations = 100;
                for (let i = 0; i < iterations; i++) {
                    const ip = getRandomIpInSubnet(cidr);
                    const ipNumber = convertIpToNumber(ip);

                    expect(ipNumber).toBeGreaterThan(networkAddress);
                    expect(ipNumber).toBeLessThan(broadcastAddress);
                }
            });
        });
    });

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
    describe('getRandomIpInSubnet', () => {
        test('generates the same random IP sequence for the same PRNG with the same seed', () => {
            const seed = 42;
            const subnet = '0.0.0.0/0';
            const sequenceLength = 5;

            const expectedIpSequence = [
                '255.255.245.109',
                '224.55.43.201',
                '10.8.228.184',
                '164.89.89.28',
                '7.222.244.210',
            ];

            const random = createRandomGenerator(seed);

            const actualIpSequence = [];
            for (let i = 0; i < sequenceLength; i++) {
                const ip = getRandomIpInSubnet(subnet, random);
                actualIpSequence.push(ip);
            }
            expect(actualIpSequence).toEqual(expectedIpSequence);
        });
    });

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
    describe('getRandomIpInSubnet', () => {
        describe('should produce approximately uniform results for an approximately uniform random generator', () => {
            test('for /31 prefix, both valid addresses are approximately equally likely', () => {
                const subnet = '192.0.2.72/31';
                const lastBitsToTest = 1;
                const sampleSize = 20_000;

                // const random = Math.random;
                const seed = 42;
                const random = createRandomGenerator(seed);

                const categoriesCount = 2 ** lastBitsToTest;
                const frequencies = new Array<number>(categoriesCount).fill(0);
                for (let i = 0; i < sampleSize; i++) {
                    const ip = getRandomIpInSubnet(subnet, random);
                    const lastBits = extractLastBitsFromIp(ip, lastBitsToTest);
                    frequencies[lastBits]! += 1;
                }

                const isUniform = isUniformlyDistributed(frequencies);
                expect(isUniform).toBe(true);
            });

            test('for /24 prefix, returns approximately uniform distribution among available hosts', () => {
                const subnet = '0.0.0.0/0';
                const lastBitsToTest = 4;
                const categoriesCount = 2 ** lastBitsToTest;
                const sampleSize = 10_000 * categoriesCount;

                // const random = Math.random;
                const seed = 42;
                const random = createRandomGenerator(seed);

                const frequencies = new Array<number>(categoriesCount).fill(0);
                for (let i = 0; i < sampleSize; i++) {
                    const ip = getRandomIpInSubnet(subnet, random);
                    const lastBits = extractLastBitsFromIp(ip, lastBitsToTest);
                    frequencies[lastBits]! += 1;
                }

                // Exclude network and broadcast addresses
                const relevantFrequencies = frequencies.slice(1, -1);

                const isUniform = isUniformlyDistributed(relevantFrequencies);
                expect(isUniform).toBe(true);
            });
        });
    });

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
