import { Logger } from '@nestjs/common';

export class ErrorException extends Error {
  logger = new Logger();
  constructor() {
    super();
    this.name = 'ErrorException';
  }
  logError(error) {
    this.logger.error(error.message, error.stack);
  }
  throwError(error) {
    this.logError(error);
    throw error;
  }
}
