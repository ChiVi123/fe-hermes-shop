import { HttpStatus } from '~/lib/fetchain/httpStatus';
import { FetchConfig } from '~/lib/fetchain/types';

const STRINGIFY_SPACE = 2;

export class HttpError extends Error {
  public readonly config: FetchConfig;
  public readonly response: Response;
  public readonly body: unknown;

  constructor(config: FetchConfig, response: Response, body: unknown) {
    super(`HTTP Error: ${response.status} ${response.statusText}`);

    this.name = HttpError.name;
    this.config = config;
    this.response = response;
    this.body = body;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  public get status(): HttpStatus {
    return this.response.status;
  }

  public toJSON(): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { baseURL, ...config } = this.config;
    return JSON.stringify(
      {
        status: this.status,
        config,
        body: this.body,
      },
      null,
      STRINGIFY_SPACE
    );
  }
}
