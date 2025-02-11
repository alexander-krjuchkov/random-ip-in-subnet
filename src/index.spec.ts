import { getRandomIpInSubnet, getRandomIpInSubnets } from './index';

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
