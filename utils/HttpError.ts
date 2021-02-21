export default class HTTPError extends Error {
  constructor(public status: number, public error: string | Error | Record<string, unknown>) {
    super(error as string);
    this.status = status;
    this.error = error;
    this.message =
      (error as Error)?.message || ((error as Record<string, unknown>)?.message as string) || (error as string);
  }
}
