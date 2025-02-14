export function convertIpToNumber(ip: string): number {
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

export function convertNumberToIp(number: number): string {
    // https://stackoverflow.com/a/8105740
    const octets = [
        (number >>> 24) & 255,
        (number >>> 16) & 255,
        (number >>> 8) & 255,
        number & 255,
    ];

    return octets.join('.');
}
