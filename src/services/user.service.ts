import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from '../dtos/users/create-user.dto';
import { UpdateUserDto } from '../dtos/users/update-user.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async getById(id: string): Promise<User | null> {
    return await this.repo.getById(id);
  }

  async getAll(): Promise<User[]> {
    return await this.repo.getAll();
  }

  async create(data: CreateUserDto): Promise<User> {
    return await this.repo.create(data);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return await this.repo.update(id, data);
  }

  async delete(where: number): Promise<User> {
    return await this.repo.delete(where);
  }
}
