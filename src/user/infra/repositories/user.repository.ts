import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@/user/infra/entities';
import { IUserRepository } from '@/user/interfaces';
import { SaveUserDTO } from '@/user/dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: SaveUserDTO): Promise<User> {
    const user: User = this.userRepository.create({
      id: data.id,
      name: data.name,
      email: data.email,
    });

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
