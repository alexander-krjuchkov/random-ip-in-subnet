import { ValidationError } from './ValidationError';

export class InvalidCidrNotationError extends ValidationError {
    constructor() {
        super('Invalid CIDR notation');
    }
}
