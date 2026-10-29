export type ProfileRutErrorReason = 'invalid' | 'cannot_modify';

export class ProfileRutError extends Error {
  constructor(public readonly reason: ProfileRutErrorReason) {
    super(`Profile RUT error: ${reason}`);
    this.name = 'ProfileRutError';
  }
}
