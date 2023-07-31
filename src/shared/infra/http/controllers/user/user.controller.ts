import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { User } from '@/user/infra/entities';
import { ListUserByIdUseCase } from '@/user/use-cases';
import { ListUserDTO } from '@/user/dto';

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
  async listUser(@Param('id') params: ListUserDTO): Promise<User> {
    const result = await this.listUserUseCase.execute(params.user_id);
    return result.user;
  }
}
