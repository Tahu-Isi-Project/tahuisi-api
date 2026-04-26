import { HTTPException } from "hono/http-exception";

export class NotFoundError extends HTTPException {
  constructor(message: string) {
    super(404, { message: message });
  }
}

export class BadRequestError extends HTTPException {
  constructor(message: string) {
    super(400, { message });
  }
}

export class UnauthorizedError extends HTTPException {
  constructor(message: string) {
    super(401, { message });
  }
}

export class ConflictError extends HTTPException {
  constructor(message: string) {
    super(409, { message });
  }
}

export class UnprocessableContentError extends HTTPException {
  constructor(message: string) {
    super(422, { message });
  }
}

export class ServerError extends HTTPException {
  constructor(message: string) {
    super(500, { message: message });
  }
}
