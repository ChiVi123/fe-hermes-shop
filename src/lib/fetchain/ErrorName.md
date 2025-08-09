# Common Error.name Values in fetch Errors

| Error.name   | Description                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| TypeError    | Most common for network failures, invalid URLs, or CORS issues in browsers. |
| AbortError   | Thrown when a request is aborted using an AbortController.                  |
| TimeoutError | In Node.js libraries like node-fetch, if a timeout is set and exceeded.     |
| FetchError   | Specific to node-fetch; wraps lower-level errors.                           |
| SystemError  | Node.js-specific, for low-level system issues (e.g., DNS lookup failure).   |
| NetworkError | Rare in browsers; sometimes used in custom implementations.                 |
| SyntaxError  | If you try to parse invalid JSON from the response.                         |
