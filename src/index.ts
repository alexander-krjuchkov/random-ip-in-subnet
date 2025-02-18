import { getNetworkAddress } from './cidr.utils';
import { convertNumberToIp } from './ip.utils';
import type { RandomGenerator } from './types';

// function getRandomIp(random: RandomGenerator): string {
//     return Array.from({ length: 4 })
//         .map(() => Math.floor(random() * 256))
//         .join('.');
// }

/**
 * @param cidrNotation e.g. '192.168.1.0/24'
 */
export function getRandomIpInSubnet(
    cidrNotation: string,
    random: RandomGenerator = Math.random,
): string {
    const [ip, prefixLengthStr] = cidrNotation.split('/');
    if (!ip || !prefixLengthStr) {
        throw new Error('Invalid CIDR notation');
    }
    const prefixLength = parseInt(prefixLengthStr, 10);
    const ipParts = ip.split('.').map(Number) as [
        number,
        number,
        number,
        number,
    ];

    if (
        ipParts.length !== 4 ||
        ipParts.some((part) => part < 0 || part > 255) ||
        prefixLength < 0 ||
        prefixLength > 32
    ) {
        throw new Error('Invalid CIDR notation');
    }

    if (prefixLength === 32) {
        // single address in subnet
        return ip;
    }

    if (prefixLength === 31) {
        // Generate one of two addresses

        const networkAddressAsNumber = getNetworkAddress(cidrNotation);

        const firstHost = convertNumberToIp(networkAddressAsNumber);

        const secondHost = convertNumberToIp(networkAddressAsNumber | 1);

        return random() < 0.5 ? firstHost : secondHost;
    }

    const totalAddresses = Math.pow(2, 32 - prefixLength);

    // Excluding network and broadcast addresses
    const randomHostNumber = Math.floor(random() * (totalAddresses - 2)) + 1;

    const networkAddressAsNumber = getNetworkAddress(cidrNotation);

    const newIpAsNumber = networkAddressAsNumber | randomHostNumber;

    // Convert new 32-bit integer IP to IP string
    const randomIP = convertNumberToIp(newIpAsNumber);

    return randomIP;
}

/**
 * @param subnets array of CIDR notation subnets, e.g. ['192.168.1.0/24']
 */
export function getRandomIpInSubnets(
    subnets: string[],
    random: RandomGenerator = Math.random,
): string {
    if (subnets.length === 0) {
        throw new Error('No subnets provided');
    }
    const subnet = subnets[Math.floor(random() * subnets.length)];
    if (!subnet) {
        throw new Error('Could not get random subnet');
    }

    return getRandomIpInSubnet(subnet, random);
}

export type { RandomGenerator };
