# random-ip-in-subnet

Generates a random IP address within the specified subnet.

## Installation

To install the latest version of the random-ip-in-subnet package from NPM,
run the following command:

```sh
npm i random-ip-in-subnet
```

## Example Code

The code below generates a random IP address within the subnet 192.0.2.0/24:

```js
import { getRandomIpInSubnet } from 'random-ip-in-subnet';

console.log(getRandomIpInSubnet('192.0.2.0/24'));
```
