export type DuplicateUserField = 'rut' | 'email' | 'unknown';

export class DuplicateUserDataError extends Error {
  constructor(public readonly field: DuplicateUserField) {
    super(`Duplicate user data: ${field}`);
    this.name = 'DuplicateUserDataError';
  }
}
