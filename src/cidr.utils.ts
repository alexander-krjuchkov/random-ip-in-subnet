import { convertIpToNumber } from './ip.utils';

function getNetworkMask(prefix: number): number {
    if (prefix < 0 || prefix > 32) {
        throw new Error('Invalid prefix length');
    }

    // Prefix specifies the number of leading bits set to one, followed by zeros
    /** @todo: implement only on binary numbers without using intermediate string */
    return parseInt('1'.repeat(prefix) + '0'.repeat(32 - prefix), 2);
}

export function parseCidrNotation(cidr: string): [number, number] {
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
    if (prefixLength < 0 || prefixLength > 32) {
        throw new Error('Invalid CIDR notation');
    }

    return [ipNumber, prefixLength];
}

export function getNetworkAddress(cidr: string): number {
    const [ipNumber, prefixLength] = parseCidrNotation(cidr);

    const networkMask = getNetworkMask(prefixLength);
    return (ipNumber & networkMask) >>> 0;
}

export function getBroadcastAddress(cidr: string): number {
    const [ipNumber, prefixLength] = parseCidrNotation(cidr);

    const networkMask = getNetworkMask(prefixLength);
    return (ipNumber | ~networkMask) >>> 0;
}
