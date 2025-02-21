import { EmptySubnetListError } from './errors/EmptySubnetListError';
import { ValidationError } from './errors/ValidationError';
import { getRandomIPv4InSubnet } from './getRandomIPv4InSubnet';
import type { RandomGenerator } from './types';

/**
 * Randomly selects a CIDR network from an array and
 * generates a random IP address.
 *
 * @param subnets A non-empty array of valid CIDR network strings
 * (e.g. ['192.0.2.0/24', '203.0.113.0/24']).
 * @param random Optional random generator function that
 * returns a number in [0, 1).
 * @returns A random IP address from one of the networks.
 * @throws {ValidationError} If the provided list of networks is
 * empty or a randomly selected subnet is invalid.
 */
export function getRandomIPv4FromSubnetList(
    subnets: string[],
    random: RandomGenerator = Math.random,
): string {
    if (subnets.length === 0) {
        throw new EmptySubnetListError();
    }

    const subnet = subnets[Math.floor(random() * subnets.length)]!;

    return getRandomIPv4InSubnet(subnet, random);
}
