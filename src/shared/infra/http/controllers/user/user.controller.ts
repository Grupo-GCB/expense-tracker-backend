import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { FindUserByIdUseCase, SignInUseCase } from '@/user/use-cases';
import { UserTokenDTO } from '@/user/dto';
import { User } from '@/user/infra/entities';
import { API_RESPONSES } from '@/shared/constants';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly findUserUseCase: FindUserByIdUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiCreatedResponse(API_RESPONSES.CREATED)
  @ApiOkResponse(API_RESPONSES.OK)
  @ApiUnauthorizedResponse(API_RESPONSES.UNAUTHORIZED)
  async signIn(
    @Req() { body }: Request<{}, {}, UserTokenDTO>,
    @Res() res: Response,
  ) {
    const { token } = body;
    const { status, message } = await this.signInUseCase.execute(token);
    return res.status(status).json({ message });
  }

  @ApiTags('User')
  @ApiOperation({
    summary: 'Listar um usuário pelo ID.',
    description: 'Esta rota permite visualizar os dados de um usuário.',
  })
  @ApiOkResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  @Get(':id')
  async findUser(@Param('id') user_id: string): Promise<User> {
    const { user } = await this.findUserUseCase.execute(user_id);
    return user;
  }
}
