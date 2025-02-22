import { getRandomIPv4InSubnet } from './getRandomIPv4InSubnet';
import { createRandomGenerator, isUniformlyDistributed } from './testing.utils';
import { IPv4Address } from './IPv4Address';
import { IPv4Network } from './IPv4Network';

function extractLastBitsFromIp(ipAddress: string, bitsCount: number): number {
    const ip = IPv4Address.fromString(ipAddress);
    return (ip.number & ((1 << bitsCount) - 1)) >>> 0;
}

/**
 * Randomized invariant testing
 *
 * These tests ensure that basic guarantees such as respecting
 * value bounds are maintained, regardless of the randomness involved.
 */
describe('Randomized invariant testing', () => {
    describe('getRandomIPv4InSubnet', () => {
        describe('for /32 prefix', () => {
            test('returns the specified IP', () => {
                const iterations = 100;
                for (let i = 0; i < iterations; i++) {
                    const inputIp = Array.from({ length: 4 })
                        .map(() => Math.floor(Math.random() * 256))
                        .join('.');
                    const cidr = `${inputIp}/32`;

                    const outputIp = getRandomIPv4InSubnet(cidr);
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
                    const outputIp = getRandomIPv4InSubnet(cidr);
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
                const network = IPv4Network.fromString(cidr);
                const networkAddress = network.networkAddress;
                const broadcastAddress = network.broadcastAddress;

                const iterations = 100;
                for (let i = 0; i < iterations; i++) {
                    const ip = getRandomIPv4InSubnet(cidr);
                    const ipNumber = IPv4Address.fromString(ip).number;

                    expect(ipNumber).toBeGreaterThan(networkAddress.number);
                    expect(ipNumber).toBeLessThan(broadcastAddress.number);
                }
            });
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
    describe('getRandomIPv4InSubnet', () => {
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
                const ip = getRandomIPv4InSubnet(subnet, random);
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
    describe('getRandomIPv4InSubnet', () => {
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
                    const ip = getRandomIPv4InSubnet(subnet, random);
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
                    const ip = getRandomIPv4InSubnet(subnet, random);
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
});

describe('Special cases', () => {
    describe('getRandomIPv4InSubnet', () => {
        describe('when subnets differ only by host bits', () => {
            test.each([
                ['192.0.2.72/31', '192.0.2.73/31'],
                ['192.0.2.72/30', '192.0.2.75/30'],
                ['192.0.2.0/24', '192.0.2.128/24'],
                ['240.0.0.0/4', '248.0.0.0/4'],
            ])(
                'should return the same result for %s and %s (ignores host bits)',
                (zeroHostBitsSubnet, nonZeroHostBitsSubnet) => {
                    const getIps = (subnet: string) => {
                        const seed = 42;
                        const random = createRandomGenerator(seed);

                        const sequenceLength = 5;
                        const ips = [];
                        for (let i = 0; i < sequenceLength; i++) {
                            const ip = getRandomIPv4InSubnet(subnet, random);
                            ips.push(ip);
                        }
                        return ips;
                    };

                    const ipsForZeroHostBits = getIps(zeroHostBitsSubnet);
                    const ipsForNonZeroHostBits = getIps(nonZeroHostBitsSubnet);

                    expect(ipsForNonZeroHostBits).toEqual(ipsForZeroHostBits);
                },
            );
        });
    });
});
