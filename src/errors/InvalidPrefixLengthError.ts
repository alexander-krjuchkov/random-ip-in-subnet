import { ValidationError } from './ValidationError';

export class InvalidPrefixLengthError extends ValidationError {
    constructor() {
        super('Invalid prefix length');
    }
}
