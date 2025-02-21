import { InvalidIPv4AddressError } from './errors/InvalidIPv4AddressError';

export class IPv4Address {
    /**
     * @param number - Integer value representing the IPv4 address,
     * must be in the range [0, 2^32 - 1].
     * @throws {Error} If the number is not an integer or is
     * out of the valid range.
     */
    constructor(public readonly number: number) {
        if (!Number.isInteger(number) || number < 0 || number > 2 ** 32 - 1) {
            throw new InvalidIPv4AddressError();
        }
    }

    /**
     * @param ip - A string in dot-decimal notation (e.g., "192.0.2.1").
     * @throws {Error} If the input string is not a valid IPv4 address.
     */
    public static fromString(ip: string): IPv4Address {
        const octets = ip.split('.').map(Number);
        if (
            octets.length !== 4 ||
            octets.some((octet) => !Number.isInteger(octet)) ||
            octets.some((octet) => octet < 0 || octet > 255)
        ) {
            throw new InvalidIPv4AddressError();
        }

        const number = octets.reduce(
            (accumulator, octet) => accumulator * 256 + octet,
            0,
        );

        return new IPv4Address(number);
    }

    private get octets() {
        return [
            (this.number >>> 24) & 255,
            (this.number >>> 16) & 255,
            (this.number >>> 8) & 255,
            this.number & 255,
        ];
    }

    /**
     * @returns The IPv4 address in dot-decimal notation (e.g., "192.0.2.1").
     */
    public toString(): string {
        return this.octets.join('.');
    }
}
