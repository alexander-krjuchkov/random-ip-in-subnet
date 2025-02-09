# Random IP address generator for CIDR subnets

Generates a random IP address within the specified subnet.

## Key features

- Generates random IP addresses based on a given CIDR.
- Supports multiple subnets.
- Allows using custom random functions (e.g., third-party PRNG algorithms).

## Generate IP address from CIDR

The library provides the function `getRandomIpInSubnet(subnet, [random])`, which generates a random IPv4 address that belongs to a specified CIDR subnet (e.g., `192.0.2.0/24`).

- For a `/32` prefix, only one address is available, so that address is returned.
- For a `/31` prefix, one of the two valid addresses is chosen at random.
- For all other prefixes, an address is randomly generated from the valid host range, excluding the network and broadcast addresses.

For more details, see the [API documentation](#api-documentation).

## Multiple subnet support

For working with multiple subnets, the library provides the function `getRandomIpInSubnets(subnets, [random])`. It accepts an array of CIDR subnets, randomly selects one of them, and generates an IP address using the logic of the `getRandomIpInSubnet` function.

For more details, see the [API documentation](#api-documentation).

## Custom random function support

By default, the library uses the native `Math.random` to generate random values.

You can also provide a custom random function to the generator. This enables the use of third-party pseudo-random number generators (PRNGs), allowing you to specify a random seed and obtain a reproducible pseudo-random sequence of IP addresses.

In accordance with the single responsibility principle, the library does not include its own PRNG implementation, leaving the selection of the PRNG to the user.

For more details, see the [API documentation](#api-documentation).

## Installation

To install the latest version of the `random-ip-in-subnet` package from NPM,
run the following command:

```sh
npm i random-ip-in-subnet
```

## API documentation

### `getRandomIpInSubnet(subnet: string, random?: () => number): string`

Generates a random IP address within the specified subnet.

**Parameters:**
- `subnet`: A string that specifies a valid subnet in CIDR notation (e.g., `'192.0.2.0/24'`).
- `random` (optional): A function that returns a pseudorandom floating-point number between 0 (inclusive) and 1 (exclusive) with an approximately uniform distribution. If not provided, `Math.random` is used.

**Returns:**
- A string representing a random IP address within the specified subnet.

### `getRandomIpInSubnets(subnets: string[], random?: () => number): string`

Randomly selects one subnet from the provided list and generates a random IP address within it.

**Parameters:**
- `subnets`: A non-empty array of strings, each specifying a valid subnet in CIDR notation (e.g., `['198.51.100.0/24', '203.0.113.0/24']`).
- `random` (optional): A function that returns a pseudorandom floating-point number between 0 (inclusive) and 1 (exclusive) with an approximately uniform distribution. If not provided, `Math.random` is used.

**Returns:**
- A string representing a random IP address from one of the provided subnets.

## Usage examples

### Generating an IP address for a given subnet

```js
import { getRandomIpInSubnet } from 'random-ip-in-subnet';

const subnet = '192.0.2.0/24';
const ip = getRandomIpInSubnet(subnet);
console.log(ip); // For example, '192.0.2.89'
```

### Using a custom random number generator

Here is an example of using a deterministic pseudorandom number generator provided by the popular [pure-rand](https://www.npmjs.com/package/pure-rand) library.

First, install the third-party library:

```sh
npm i pure-rand
```

The example uses the `xoroshiro128plus` generator with a seed:

```js
import {
    xoroshiro128plus,
    unsafeUniformIntDistribution,
    type RandomGenerator as PureRandomGenerator,
} from 'pure-rand';
import { getRandomIpInSubnet } from 'random-ip-in-subnet';

function generateFloat32(rng: PureRandomGenerator): number {
    const limit = 1 << 24;
    return unsafeUniformIntDistribution(0, limit - 1, rng) / limit;
}

const seed = 42;
const rng = xoroshiro128plus(seed);
const customRandom = () => generateFloat32(rng);

const subnet = '240.0.0.0/4';
const ip1 = getRandomIpInSubnet(subnet, customRandom);
console.log(ip1); // '255.255.253.79'
const ip2 = getRandomIpInSubnet(subnet, customRandom);
console.log(ip2); // '253.79.174.143'
```

### Generating an IP from array of subnets

```js
import { getRandomIpInSubnets } from 'random-ip-in-subnet';

const subnets = ['198.51.100.0/24', '203.0.113.0/24'];
const ip = getRandomIpInSubnets(subnets);
console.log(ip);
```

## Roadmap

* ✅ ~~**Improve documentation**~~  
    ~~Documentation should clearly describe the functionality of the library and provide a clear understanding of its purpose and features.~~

* ❑ **Implement testing**  
    Testing is an essential part of developing a high-quality product.
    Despite the challenges of implementing tests for a library that works with random variables, testing should still be integrated into the library to improve reliability and correctness.

* ❑ **Expand the roadmap**  
    Consider expanding the project roadmap to include additional goals and long-term plans for the library's development.

## Contribute

Improvement suggestions are welcome.

If you have ideas or have found a problem, please open an Issue or submit a Pull Request.

## License

License: ISC.

See [LICENSE](./LICENSE) for details.
