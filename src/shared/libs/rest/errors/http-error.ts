export class HttpError extends Error {
  public httpStatusCode!: number;
  public detail?: string;

  constructor(httpStatusCode: number, message: string) {
    super(message);

    this.httpStatusCode = httpStatusCode;
    this.message = message;
  }
}
