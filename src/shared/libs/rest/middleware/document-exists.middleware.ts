import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IDocumentExistsService, IMiddleware } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';

export class DocumentExistsMiddleware implements IMiddleware {
  constructor(
    private readonly service: IDocumentExistsService,
    private readonly paramName: string,
    private readonly entityName = 'Document'
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = req.params[this.paramName];

    if (!documentId) {
      const error = new HttpError(
        StatusCodes.BAD_REQUEST,
        `Param «${this.paramName}» is required.`
      );
      error.detail = 'DocumentExistsMiddleware';
      return next(error);
    }

    const exists = await this.service.exists(documentId);
    if (!exists) {
      const error = new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with id ${documentId} not found.`
      );
      error.detail = 'DocumentExistsMiddleware';
      return next(error);
    }

    next();
  }
}
