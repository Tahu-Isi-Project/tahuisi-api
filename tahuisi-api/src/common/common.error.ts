import { HTTPException } from "hono/http-exception";

export class NotFoundError extends HTTPException {
  constructor(message: string) {
    super(404, { message: message });
  }
}

export class ServerError extends HTTPException {
  constructor(message: string) {
    super(500, { message: message });
  }
}
