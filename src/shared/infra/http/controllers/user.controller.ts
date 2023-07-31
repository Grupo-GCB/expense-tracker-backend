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
    summary: 'List an user by ID',
    description: 'This route allows user to list your personal data by ID.',
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
    description: 'User not found!',
  })
  @Get(':id')
  async listUser(@Param('id') user_id: string): Promise<User> {
    const result = await this.listUserUseCase.execute(user_id);
    return result.user;
  }
}
