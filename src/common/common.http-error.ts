import { HTTPException } from "hono/http-exception";

export class NotFoundError extends HTTPException {
  constructor(message: string) {
    super(404, { message: message });
  }
}

export class BadRequestError extends HTTPException {
  constructor(message?: string) {
    super(400, { message: message || "Bad Request" });
  }
}

export class UnauthorizedError extends HTTPException {
  constructor(message?: string) {
    super(401, { message: message || "Unauthorized" });
  }
}

export class ConflictError extends HTTPException {
  constructor(message: string) {
    super(409, { message });
  }
}

export class UnprocessableContentError extends HTTPException {
  constructor(message: string, cause?: string) {
    super(422, { message, cause });
  }
}

export class InternalServerError extends HTTPException {
  constructor(message: string) {
    super(500, { message: message });
  }
}
