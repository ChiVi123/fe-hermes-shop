import { HttpStatus } from '~/lib/fetchClient/httpStatus';
import { FetchConfig } from '~/lib/fetchClient/types';

const STRINGIFY_SPACE = 2;

export class FetchError extends Error {
  public readonly status: HttpStatus;
  public readonly config: FetchConfig;
  public readonly data?: Record<string, unknown> | null;

  constructor(status: HttpStatus, config: FetchConfig, data?: Record<string, unknown> | null) {
    super('FetchError');

    this.status = status;
    this.config = config;
    this.data = data;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    Object.setPrototypeOf(this, FetchError.prototype);
  }

  public toJSON(): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { baseURL, ...config } = this.config;
    return JSON.stringify(
      {
        status: this.status,
        config,
        data: this.data,
      },
      null,
      STRINGIFY_SPACE
    );
  }
}
