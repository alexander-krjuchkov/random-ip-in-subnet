import { getRandomIpInSubnet } from './getRandomIpInSubnet';
import type { RandomGenerator } from './types';

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
