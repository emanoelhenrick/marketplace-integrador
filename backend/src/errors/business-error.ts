export class BusinessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BusinessError";
  }
}

export class NotFoundError extends BusinessError {
  constructor(message = "Registro não encontrado.") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends BusinessError {
  constructor(message = "Usuário sem permissão.") {
    super(message);
    this.name = "ForbiddenError";
  }
}
