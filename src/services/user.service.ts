import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from '../dtos/users/create-user.dto';
import { UpdateUserDto } from '../dtos/users/update-user.dto';
import { IUserRepository, UserRepository } from '../repositories/user.repository';

export interface IUserService {
  getById(id: string): Promise<User | null>;
  getAll(): Promise<User[]>;
  create(data: CreateUserDto): Promise<User>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<User>;
  deleteAll(): Promise<any>;
}
export const IUserService = Symbol('IUserService');
@Injectable()
export class UserService implements IUserService {
  constructor(@Inject(IUserRepository) private readonly repo: IUserRepository) {}

  async getById(id: string): Promise<User | null> {
    const data = await this.repo.getById(id);
    if (data === null) {
      throw new NotFoundException([`Usuario ${id} não encontrado.`]);
    }
    return data;
  }

  async getAll(): Promise<User[]> {
    return await this.repo.getAll();
  }

  async create(data: CreateUserDto): Promise<User> {
    return await this.repo.create(data);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const retorno = await this.repo.getById(id);
    if (retorno === null) {
      throw new NotFoundException([`Usuario ${id} não encontrado.`]);
    }
    return await this.repo.update(id, data);
  }

  async delete(id: string): Promise<User> {
    const retorno = await this.repo.getById(id.toString());
    if (retorno === null) {
      throw new NotFoundException([`Usuario ${id} não encontrado.`]);
    }
    return await this.repo.delete(id);
  }
  async deleteAll(): Promise<any> {
    return await this.repo.deleteAll();
  }
}
