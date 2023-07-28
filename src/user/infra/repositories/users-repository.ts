import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SaveUserDTO } from '@/user/dtos';
import { User } from '@/user/infra/entities';
import { IUsersRepository } from '@/user/interfaces';

@Injectable()
export class UserRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(data: SaveUserDTO): Promise<User> {
    const user: User = this.usersRepository.create({
      id: data.id,
      name: data.name,
      email: data.email,
    });

    return this.usersRepository.save(user);
  }
}
