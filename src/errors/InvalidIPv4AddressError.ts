import { ValidationError } from './ValidationError';

export class InvalidIPv4AddressError extends ValidationError {
    constructor() {
        super('Invalid IPv4 address');
    }
}
