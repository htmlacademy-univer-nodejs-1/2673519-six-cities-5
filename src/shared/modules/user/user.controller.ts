import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod, ValidateDtoMiddleware } from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { IUserService } from './user-service.interface.js';
import { IConfig, RestSchema } from '../../libs/config/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { plainToInstance } from 'class-transformer';
import { getSHA256 } from '../../helpers/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.UserService) private readonly userService: IUserService,
    @inject(Component.Config) private readonly configService: IConfig<RestSchema>,
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
    this.addRoute({ path: '/logout', method: HttpMethod.Post, handler: this.logout });
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

    this.ok(res, plainToInstance(UserRdo, existsUser, { excludeExtraneousValues: true }));
  }

  public async logout(_req: Request, res: Response): Promise<void> {
    this.noContent(res, { message: 'Logged out successfully' });
  }
}
