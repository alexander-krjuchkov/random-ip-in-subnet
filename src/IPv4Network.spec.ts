import { IPv4Address } from './IPv4Address';
import { IPv4Network } from './IPv4Network';

describe('IPv4Network', () => {
    describe('constructor should create a valid instance', () => {
        const testCases = [
            {
                ipString: '192.0.2.0',
                prefixLength: 24,
                expectedNetworkMask: 0b11111111_11111111_11111111_00000000,
                expectedNetworkAddress: '192.0.2.0',
                expectedBroadcastAddress: '192.0.2.255',
                description: 'the IP address is already a network address',
            },
            {
                ipString: '192.0.2.1',
                prefixLength: 24,
                expectedNetworkMask: 0b11111111_11111111_11111111_00000000,
                expectedNetworkAddress: '192.0.2.0',
                expectedBroadcastAddress: '192.0.2.255',
                description: 'host part of the IP address should be ignored',
            },
            {
                ipString: '0.0.0.0',
                prefixLength: 0,
                expectedNetworkMask: 0,
                expectedNetworkAddress: '0.0.0.0',
                expectedBroadcastAddress: '255.255.255.255',
                description: 'min prefix length - whole IPv4 address space',
            },
            {
                ipString: '203.0.113.99',
                prefixLength: 32,
                expectedNetworkMask: 0b11111111_11111111_11111111_11111111,
                expectedNetworkAddress: '203.0.113.99',
                expectedBroadcastAddress: '203.0.113.99',
                description: 'max prefix length - single IP in subnet',
            },
        ];

        test.each(testCases)(
            'for $ipString address and /$prefixLength prefix ($description)',
            ({
                ipString,
                prefixLength,
                expectedNetworkMask,
                expectedNetworkAddress,
                expectedBroadcastAddress,
            }) => {
                const ip = IPv4Address.fromString(ipString);
                const network = new IPv4Network(ip, prefixLength);

                expect(network.prefixLength).toBe(prefixLength);
                expect(network.networkMask).toBe(expectedNetworkMask);
                expect(network.networkAddress.toString()).toBe(
                    expectedNetworkAddress,
                );
                expect(network.broadcastAddress.toString()).toBe(
                    expectedBroadcastAddress,
                );
            },
        );
    });

    describe('constructor should throw an error', () => {
        const error = 'Invalid prefix length';

        const testCases = [
            {
                ipString: '192.0.2.1',
                prefixLength: -1,
                description: 'for a negative prefix',
            },
            {
                ipString: '192.0.2.1',
                prefixLength: 33,
                description: 'for a prefix greater than 32',
            },
            {
                ipString: '192.0.2.1',
                prefixLength: 24.5,
                description: 'for a non-integer prefix',
            },
        ];

        test.each(testCases)('$description', ({ ipString, prefixLength }) => {
            const ip = IPv4Address.fromString(ipString);
            expect(() => new IPv4Network(ip, prefixLength)).toThrow(error);
        });
    });

    describe('fromString should create a valid instance', () => {
        test('from "192.0.2.0/24"', () => {
            const network = IPv4Network.fromString('192.0.2.0/24');
            const expectedMask = 0b11111111_11111111_11111111_00000000;
            expect(network.prefixLength).toBe(24);
            expect(network.networkMask).toBe(expectedMask);
            expect(network.networkAddress.toString()).toBe('192.0.2.0');
            expect(network.broadcastAddress.toString()).toBe('192.0.2.255');
        });
    });

    describe('fromString should throw an error', () => {
        const invalidCidrError = 'Invalid CIDR notation';
        const invalidIpError = 'Invalid IPv4 address';
        const invalidPrefixError = 'Invalid prefix length';

        const testCases = [
            {
                description: 'for CIDR notation missing "/"',
                input: '192.0.2.1',
                error: invalidCidrError,
            },
            {
                description: 'for CIDR notation with too many "/"',
                input: '192.0.2.1/24/extra',
                error: invalidCidrError,
            },
            {
                description: 'for an empty IP part in CIDR notation',
                input: '/24',
                error: invalidIpError,
            },
            {
                description: 'for an invalid IP part in CIDR notation',
                input: '999.999.999.999/24',
                error: invalidIpError,
            },
            {
                description: 'for a non-numeric prefix in CIDR notation',
                input: '192.0.2.1/a',
                error: invalidPrefixError,
            },
            {
                description: 'for a negative prefix in CIDR notation',
                input: '192.0.2.1/-1',
                error: invalidPrefixError,
            },
            {
                description: 'for a prefix greater than 32 in CIDR notation',
                input: '192.0.2.1/33',
                error: invalidPrefixError,
            },
        ];

        test.each(testCases)('$description', ({ input, error }) => {
            expect(() => IPv4Network.fromString(input)).toThrow(error);
        });
    });
});
