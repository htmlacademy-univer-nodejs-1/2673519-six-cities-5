import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import { nanoid } from 'nanoid';
import { NextFunction, Request, Response } from 'express';
import { resolve } from 'node:path';
import { StatusCodes } from 'http-status-codes';
import { IMiddleware } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';

export class UploadFileMiddleware implements IMiddleware {
  private readonly uploader: multer.Multer;

  constructor(
    uploadDirectory: string,
    private readonly fieldName: string,
    private readonly allowedMimeTypes: ReadonlyArray<string> = ['image/jpeg', 'image/png']
  ) {
    const destination = resolve(uploadDirectory);

    const storage = diskStorage({
      destination: (_req, _file, callback) => callback(null, destination),
      filename: (_req, file, callback) => {
        const fileExtension = file.mimetype === 'image/jpeg' ? 'jpg' : extension(file.mimetype);
        const filename = fileExtension ? `${nanoid()}.${fileExtension}` : nanoid();
        callback(null, filename);
      },
    });

    this.uploader = multer({
      storage,
      fileFilter: (_req, file, callback) => {
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
          const error = new HttpError(
            StatusCodes.BAD_REQUEST,
            'Only JPG and PNG images are allowed.'
          );
          error.detail = 'UploadFileMiddleware';
          return callback(error);
        }

        callback(null, true);
      },
    });
  }

  public execute(req: Request, res: Response, next: NextFunction): void {
    this.uploader.single(this.fieldName)(req, res, next);
  }
}
