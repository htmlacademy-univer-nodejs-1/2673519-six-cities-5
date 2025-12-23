import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod, PrivateRouteMiddleware, UploadFileMiddleware, ValidateDtoMiddleware } from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { IUserService } from './user-service.interface.js';
import { IConfig, RestSchema } from '../../libs/config/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { plainToInstance } from 'class-transformer';
import { getSHA256 } from '../../helpers/index.js';
import { resolve } from 'node:path';
import { IAuthService } from '../../libs/auth/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.UserService) private readonly userService: IUserService,
    @inject(Component.Config) private readonly configService: IConfig<RestSchema>,
    @inject(Component.AuthService) private readonly authService: IAuthService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [new PrivateRouteMiddleware(this.authService)],
    });

    this.addRoute({
      path: '/status',
      method: HttpMethod.Get,
      handler: this.status,
      middlewares: [new PrivateRouteMiddleware(this.authService)],
    });

    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(this.authService),
        new UploadFileMiddleware(
          resolve(process.cwd(), this.configService.get('UPLOAD_DIRECTORY'), 'avatars'),
          'avatar'
        ),
      ],
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateUserDto;
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, plainToInstance(UserRdo, result, { excludeExtraneousValues: true }));
  }

  public async login(
    req: Request,
    res: Response,
  ): Promise<void> {
    const body = req.body as LoginUserDto;
    const existsUser = await this.userService.findByEmail(body.email);

    if (! existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`
      );
    }

    const passwordHash = getSHA256(body.password, this.configService.get('SALT'));

    if (passwordHash !== existsUser.password) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid password.'
      );
    }

    const token = await this.authService.sign({
      id: existsUser.id,
      email: existsUser.email,
    });

    this.ok(res, {
      token,
      user: plainToInstance(UserRdo, existsUser, { excludeExtraneousValues: true })
    });
  }

  public async logout(_req: Request, res: Response): Promise<void> {
    this.noContent(res, {});
  }

  public async status(req: Request, res: Response): Promise<void> {
    const userEmail = req.user?.email;

    if (!userEmail) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization required.');
    }

    const user = await this.userService.findByEmail(userEmail);

    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, `User with email ${userEmail} not found.`);
    }

    this.ok(res, plainToInstance(UserRdo, user, { excludeExtraneousValues: true }));
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization required.');
    }
    const file = (req as Request & { file?: Express.Multer.File }).file;

    if (!file) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Avatar file is required.');
    }

    const avatarPath = `avatars/${file.filename}`;
    const updatedUser = await this.userService.updateAvatar(userId, avatarPath);

    if (!updatedUser) {
      throw new HttpError(StatusCodes.NOT_FOUND, `User with id ${userId} not found.`);
    }

    this.ok(res, plainToInstance(UserRdo, updatedUser, { excludeExtraneousValues: true }));
  }
}
