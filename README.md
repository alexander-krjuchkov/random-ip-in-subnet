# Random IP Generator from Subnets (Custom RNG Support)

[![NPM Version](https://img.shields.io/npm/v/random-ip-in-subnet)](https://www.npmjs.com/package/random-ip-in-subnet)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Generates random IPv4 addresses from CIDR subnets.

Supports custom random functions, multiple subnets, and is perfect for testing, simulations, and network-related projects.

## Overview

- **Well-tested**: Fully tested and reliable.
- **Dependency-free**: Zero runtime dependencies.
- **Predictable**: Supports custom random functions for reproducible results.

## Features

- Generate random IPs from single or multiple CIDR subnets.
- Excludes network and broadcast addresses where appropriate.
- Plug in your own random number generator, e.g., seeded PRNGs for deterministic output.
- Useful for testing, simulations, or network-related projects.

## Quick Start

### Installation

Install the latest version of the `random-ip-in-subnet` package via NPM:

```sh
npm i random-ip-in-subnet
```

### Generate an IP from a single subnet

```js
import { getRandomIPv4InSubnet } from 'random-ip-in-subnet';

const subnet = '192.0.2.0/24';
const ip = getRandomIPv4InSubnet(subnet);
console.log(ip); // e.g., '192.0.2.89'
```

### Generate an IP from multiple subnets

```js
import { getRandomIPv4FromSubnetList } from 'random-ip-in-subnet';

const subnets = ['198.51.100.0/24', '203.0.113.0/24'];
const ip = getRandomIPv4FromSubnetList(subnets);
console.log(ip); // e.g., '198.51.100.123' or '203.0.113.89'
```

## API Reference

### Common parameters

These parameters are shared among several functions in the library.

#### CIDR notation subnet

A string representing a valid subnet in CIDR notation.  
For IPv4, this is a string of 4 decimal numbers representing the 4 octets of bits separated by dots, followed by a slash (`/`) and a decimal number from 0 (inclusive) to 32 (inclusive) indicating the prefix length.  
**Example**: `'192.0.2.0/24'`.  
**Note**: The library ignores host bits if present (e.g., '192.0.2.1/24' is treated as '192.0.2.0/24'). However, it is recommended to use subnets with host bits set to 0, such as `192.0.2.0/24`, as this more clearly defines network boundaries and makes them easier to read and work with.

#### Optional random generator

A function that returns a pseudorandom floating-point number between 0 (inclusive) and 1 (exclusive) with an approximately uniform distribution.  
If not provided, `Math.random` is used.

### `getRandomIPv4InSubnet(subnet: string, random?: () => number): string`

Generates a random IP address that belongs to the specified CIDR subnet.

**Parameters:**
- `subnet`: A string representing a valid subnet in CIDR notation. See [CIDR notation subnet](#cidr-notation-subnet).
- `random` (optional): Random number generator function. See [Optional random generator](#optional-random-generator).

**Returns**:
A random IP address as a string.

**Behavior:**
- For a `/32` prefix: Only one address is available, so that address is returned.
- For a `/31` prefix: Randomly selects one of the two addresses (both are considered usable).
- For all other prefixes (`/0`-`/30`): Returns a random host address, excluding network and broadcast addresses.

**Throws:**
- `ValidationError` if the subnet is invalid.

### `getRandomIPv4FromSubnetList(subnets: string[], random?: () => number): string`

Randomly selects a subnet from the list and returns a random IP from it.

**Parameters:**
- `subnets`: A non-empty array of strings, each representing a valid subnet in CIDR notation. See [CIDR notation subnet](#cidr-notation-subnet).
- `random` (optional): Random number generator function. See [Optional random generator](#optional-random-generator).

**Returns**:
A random IP address as a string.

**Behavior**:
Randomly selects a subnet from the provided list and generates a random IP address within it using the logic of the `getRandomIPv4InSubnet` function.

**Throws:**
- `ValidationError` if the list is empty or a randomly selected subnet is invalid.

## Custom Random Generator

By default, `Math.random()` is used.

You can also provide a custom random function to the generator. This allows you to use third-party pseudo-random number generators (PRNGs) to produce a reproducible pseudo-random sequence of IP addresses.

In accordance with the single-responsibility principle, the library does not include its own PRNG implementation, leaving the choice of PRNG to the user.

The following example uses the popular [pure-rand](https://www.npmjs.com/package/pure-rand) library (if not installed, install it with `npm i pure-rand`).

```ts
import {
    xoroshiro128plus,
    unsafeUniformIntDistribution,
    type RandomGenerator as PureRandomGenerator,
} from 'pure-rand';
import { getRandomIPv4InSubnet } from 'random-ip-in-subnet';

function generateFloat64(rng: PureRandomGenerator) {
    const upper = unsafeUniformIntDistribution(0, (1 << 26) - 1, rng);
    const lower = unsafeUniformIntDistribution(0, (1 << 27) - 1, rng);
    return (upper * 2 ** 27 + lower) * 2 ** -53;
}

const seed = 42;
const rng = xoroshiro128plus(seed);
const customRandom = () => generateFloat64(rng);

const subnet = '240.0.0.0/4';
const ip1 = getRandomIPv4InSubnet(subnet, customRandom);
const ip2 = getRandomIPv4InSubnet(subnet, customRandom);
// Always the same sequence for this seed:
console.log(ip1); // '255.255.255.85'
console.log(ip2); // '254.3.114.187'
```

## Error Handling

`ValidationError` class is exported as part of the public API, allowing you to distinguish library-specific errors from other exceptions.  
Catch it like this:

```js
import { getRandomIPv4InSubnet, ValidationError } from 'random-ip-in-subnet';

const subnet = 'invalid_subnet';

try {
    const ip = getRandomIPv4InSubnet(subnet);
    // Your code here...
} catch (error) {
    if (error instanceof ValidationError) {
        console.error('Invalid subnet:', error.message);
    } else {
        throw error;
    }
}
```

## Roadmap

- [ ] Add IPv6 support

## Changelog

For a detailed list of changes, please see [CHANGELOG](./CHANGELOG.md).

## Contributing

Improvement suggestions are welcome.

Found a bug or have an idea? Open an [Issue](https://github.com/alexander-krjuchkov/random-ip-in-subnet/issues) or submit a [Pull request](https://github.com/alexander-krjuchkov/random-ip-in-subnet/pulls) on GitHub.

Before committing changes, run tests locally:

```sh
npm run test
```

## License

License: ISC.

See [LICENSE](./LICENSE) for details.
