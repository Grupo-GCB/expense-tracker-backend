import { Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { SignInUseCase } from '@/user/use-cases';
import { UserTokenDTO } from '@/user/dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private signInUseCase: SignInUseCase,
    private listUserUseCase: ListUserByIdUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI56465xMjM0NTY3ODkAsdASAdasbdwIiwibmFtZSI6IkpsasSsefguiefhvj0JAShghfgpR23457HgaFG34934IV9SDV3sssADTNHYNÇGHv&TIF45TJ56I7TVI7ISXAAWFcasxcatjAcx3vaG4gRG9GJK5667lIitrrtFASDFku5wiaWFsdfsdc0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        },
      },
      required: ['token'],
    },
  })
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
  async create(@Req() { body }: Request, @Res() res: Response) {
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
