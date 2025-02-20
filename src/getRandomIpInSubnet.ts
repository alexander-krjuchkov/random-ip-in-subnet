import { IPv4Address } from './IPv4Address';
import { IPv4Network } from './IPv4Network';
import type { RandomGenerator } from './types';

/**
 * @param cidrNotation e.g. '192.168.1.0/24'
 */
export function getRandomIpInSubnet(
    cidrNotation: string,
    random: RandomGenerator = Math.random,
): string {
    const network = IPv4Network.fromString(cidrNotation);
    const prefixLength = network.prefixLength;
    const networkAddress = network.networkAddress;

    if (prefixLength === 32) {
        // single address in subnet
        return network.networkAddress.toString();
    }

    if (prefixLength === 31) {
        // Generate one of two addresses
        const firstHost = networkAddress;
        const secondHost = new IPv4Address((networkAddress.number | 1) >>> 0);

        const randomHost = random() < 0.5 ? firstHost : secondHost;
        return randomHost.toString();
    }

    const totalAddresses = 2 ** (32 - prefixLength);

    // Excluding network and broadcast addresses
    const randomHostNumber = Math.floor(random() * (totalAddresses - 2)) + 1;

    const randomHost = new IPv4Address(
        (networkAddress.number | randomHostNumber) >>> 0,
    );
    return randomHost.toString();
}
