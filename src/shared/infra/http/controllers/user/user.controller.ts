import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { ListUserByIdUseCase, SignInUseCase } from '@/user/use-cases';
import { UserTokenDTO } from '@/user/dto';
import { User } from '@/user/infra/entities';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private signInUseCase: SignInUseCase,
    private listUserUseCase: ListUserByIdUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async signIn(@Req() { body }: Request, @Res() res: Response) {
    const { token } = body as UserTokenDTO;
    const { status, message } = await this.signInUseCase.execute(token);
    return res.status(status).json({ message });
  }

  @ApiTags('User')
  @ApiOperation({
    summary: 'Listar um usuário pelo ID.',
    description: 'Esta rota permite visualizar os dados de um usuário.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'google-oauth2|456734566205483104315',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado.',
  })
  @Get(':id')
  async listUser(@Param('id') user_id: string): Promise<User> {
    const { user } = await this.listUserUseCase.execute(user_id);
    return user;
  }
}
