import { ValidationError } from './errors/ValidationError';
import { IPv4Address } from './IPv4Address';
import { IPv4Network } from './IPv4Network';
import type { RandomGenerator } from './types';

/**
 * Generates a random IP address within a specified CIDR network.
 *
 * Special cases:
 * - For a `/32` prefix, one available IP address is returned.
 * - For a `/31` prefix, returns one of the two valid addresses.
 * - Otherwise, generates an IP from the valid host range,
 * excluding the network and broadcast addresses.
 *
 * @param cidrNotation A valid CIDR network string (e.g. '192.0.2.0/24').
 * @param random Optional random generator function that
 * returns a number in [0, 1).
 * @returns A random IP address from the given network.
 * @throws {ValidationError} If the provided network is invalid.
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
