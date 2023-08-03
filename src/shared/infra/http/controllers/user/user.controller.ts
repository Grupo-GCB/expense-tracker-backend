import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { User } from '@/user/infra/entities';
import { ListUserByIdUseCase } from '@/user/use-cases';

@Controller('user')
export class UserController {
  constructor(private readonly listUserUseCase: ListUserByIdUseCase) {}

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
