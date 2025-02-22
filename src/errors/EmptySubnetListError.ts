import { ValidationError } from './ValidationError';

export class EmptySubnetListError extends ValidationError {
    constructor() {
        super('Empty subnet list');
    }
}
