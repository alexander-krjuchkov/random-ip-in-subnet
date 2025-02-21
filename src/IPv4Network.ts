import { InvalidCidrNotationError } from './errors/InvalidCidrNotationError';
import { InvalidPrefixLengthError } from './errors/InvalidPrefixLengthError';
import { IPv4Address } from './IPv4Address';

/**
 * Represents an IPv4 network in CIDR notation.
 */
export class IPv4Network {
    public readonly networkMask: number;
    public readonly networkAddress: IPv4Address;
    public readonly broadcastAddress: IPv4Address;

    /**
     * @param ip - Base IPv4 address.
     * @param prefixLength - Network prefix length
     * as an integer in the inclusive range [0, 32].
     * @throws {Error} If prefix is invalid.
     */
    public constructor(
        ip: IPv4Address,
        public readonly prefixLength: number,
    ) {
        IPv4Network.validatePrefixLength(prefixLength);

        this.networkMask = IPv4Network.calculateNetworkMask(prefixLength);
        this.networkAddress = new IPv4Address(
            (ip.number & this.networkMask) >>> 0,
        );
        this.broadcastAddress = new IPv4Address(
            (ip.number | ~this.networkMask) >>> 0,
        );
    }

    private static validatePrefixLength(prefix: number): void {
        if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
            throw new InvalidPrefixLengthError();
        }
    }

    private static calculateNetworkMask(prefix: number): number {
        // Prefix specifies the number of leading bits set to one, followed by zeros
        if (prefix === 0) {
            return 0;
        }
        return (-1 << (32 - prefix)) >>> 0;
    }

    /**
     * @param cidrNotation - IPv4 CIDR notation string (e.g., "192.0.2.0/24").
     * @throws {Error} If the input is invalid.
     */
    public static fromString(cidrNotation: string): IPv4Network {
        const parts = cidrNotation.split('/');
        if (
            parts.length !== 2 ||
            parts[0] === undefined ||
            parts[1] === undefined
        ) {
            throw new InvalidCidrNotationError();
        }

        const ip = IPv4Address.fromString(parts[0]);
        const prefix = parseInt(parts[1], 10);

        return new IPv4Network(ip, prefix);
    }
}
