import { InvalidIPv4AddressError } from './errors/InvalidIPv4AddressError';
import { IPv4Address } from './IPv4Address';

describe('IPv4Address', () => {
    const testNet1Host1Number = 3221225985; // '192.0.2.1'

    describe('constructor should create a valid instance', () => {
        const testCases = [
            { ipString: '192.0.2.1', ipNumber: testNet1Host1Number },
            { ipString: '0.0.0.0', ipNumber: 0 },
            { ipString: '255.255.255.255', ipNumber: 2 ** 32 - 1 },
        ];

        test.each(testCases)(`for "$ipString"`, ({ ipString, ipNumber }) => {
            const ip = new IPv4Address(ipNumber);
            expect(ip.number).toBe(ipNumber);
            expect(ip.toString()).toBe(ipString);
        });
    });

    describe('constructor should throw an error', () => {
        const error = InvalidIPv4AddressError;

        const testCases = [
            { description: 'non-integer number', input: 0.5 },
            { description: 'negative number', input: -1 },
            { description: 'number greater than 2^32 - 1', input: 2 ** 32 },
        ];
        test.each(testCases)('for $description', ({ input }) => {
            expect(() => new IPv4Address(input)).toThrow(error);
        });
    });

    describe('fromString should create a valid instance', () => {
        const testCases = [
            { ipString: '192.0.2.1', ipNumber: testNet1Host1Number },
            { ipString: '0.0.0.0', ipNumber: 0 },
            { ipString: '255.255.255.255', ipNumber: 2 ** 32 - 1 },
        ];

        test.each(testCases)(`from "$ipString"`, ({ ipString, ipNumber }) => {
            const ip = IPv4Address.fromString(ipString);
            expect(ip.number).toBe(ipNumber);
            expect(ip.toString()).toBe(ipString);
        });
    });

    describe('fromString should throw an error', () => {
        const error = InvalidIPv4AddressError;

        const testCases = [
            { description: 'less than 4 octets', input: '192.0.2' },
            { description: 'more than 4 octets', input: '192.0.2.1.5' },
            { description: 'non-numeric octet', input: '192.0.2.a' },
            { description: 'a float number octet', input: '192.0.2.1e-1' },
            { description: 'octet > 255', input: '192.0.2.256' },
            { description: 'a negative octet', input: '192.-1.2.3' },
        ];

        test.each(testCases)('for a string with $description', ({ input }) => {
            expect(() => IPv4Address.fromString(input)).toThrow(error);
        });
    });
});
