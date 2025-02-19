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

Before using the functions, please review the common parameters below.

### Common parameters

These parameters are shared among several functions in the library.

#### CIDR notation subnet

A string representing a valid subnet in CIDR notation.  
For IPv4, this is a string of 4 decimal numbers representing the 4 octets of bits separated by dots, followed by a slash (`/`) and a decimal number from 0 (inclusive) to 32 (inclusive) indicating the prefix length.  

Example: `'192.0.2.0/24'`.

Note: If the provided CIDR includes host bits, they will be ignored. For example, if you pass the CIDR `192.0.2.1/24`, the network address `192.0.2.0/24` will be used.
However, it is recommended to use subnets with host bits set to 0, such as `192.0.2.0/24`, as this more clearly defines network boundaries and makes them easier to read and work with.

#### Optional parameter: random generator

A function that returns a pseudorandom floating-point number between 0 (inclusive) and 1 (exclusive) with an approximately uniform distribution.

If not provided, `Math.random` is used.

### Functions

#### `getRandomIpInSubnet(subnet: string, random?: () => number): string`

Generates a random IP address within the specified subnet.

**Parameters:**
- `subnet`: A string representing a valid subnet in CIDR notation. See [CIDR notation subnet](#cidr-notation-subnet).
- `random` (optional): A function to generate a pseudorandom number. See [Optional parameter: random generator](#optional-parameter-random-generator).

**Returns:**
- A string representing a random IP address within the specified subnet.

#### `getRandomIpInSubnets(subnets: string[], random?: () => number): string`

Randomly selects one subnet from the provided list and generates a random IP address within it.

**Parameters:**
- `subnets`: A non-empty array of strings, each representing a valid subnet in CIDR notation. See [CIDR notation subnet](#cidr-notation-subnet).
- `random` (optional): A function to generate a pseudorandom number. See [Optional parameter: random generator](#optional-parameter-random-generator).

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

```ts
import {
    xoroshiro128plus,
    unsafeUniformIntDistribution,
    type RandomGenerator as PureRandomGenerator,
} from 'pure-rand';
import { getRandomIpInSubnet } from 'random-ip-in-subnet';

function generateFloat64(rng: PureRandomGenerator) {
    const upper = unsafeUniformIntDistribution(0, (1 << 26) - 1, rng);
    const lower = unsafeUniformIntDistribution(0, (1 << 27) - 1, rng);
    return (upper * 2 ** 27 + lower) * 2 ** -53;
}

const seed = 42;
const rng = xoroshiro128plus(seed);
const customRandom = () => generateFloat64(rng);

const subnet = '240.0.0.0/4';
const ip1 = getRandomIpInSubnet(subnet, customRandom);
console.log(ip1); // '255.255.255.85'
const ip2 = getRandomIpInSubnet(subnet, customRandom);
console.log(ip2); // '254.3.114.187'
```

### Generating an IP from array of subnets

```js
import { getRandomIpInSubnets } from 'random-ip-in-subnet';

const subnets = ['198.51.100.0/24', '203.0.113.0/24'];
const ip = getRandomIpInSubnets(subnets);
console.log(ip);
```

## Roadmap

* ⊟ **v1.0**
    - ❑ **Improve validation**  
    Make input validation stricter, rework error handling, add error handling tests.

    - ⊟ **Refactor**  
    Improve naming, refactor code for clarity and maintainability, add additional tests where needed.

    - ✅ ~~**Handle non-zero host bits in subnets**~~  
    ~~Handle the case of non-zero host bits in a given subnet: either throw a validation exception or ignore them. The previous version of the library does neither, which may cause this case to produce incorrect results.~~

* ❑ **v1.1**
    - **Add IPv6 support**  
    Add IPv6 support for better compliance with modern networking standards.

## Changelog

For a detailed list of changes, please see [CHANGELOG](./CHANGELOG.md).

## Contribute

Improvement suggestions are welcome.

If you have ideas or have found a problem, please open an Issue or submit a Pull Request.

Before committing changes, run tests with the following command:

```sh
npm run test
```

## License

License: ISC.

See [LICENSE](./LICENSE) for details.
