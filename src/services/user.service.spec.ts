import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from './prisma.service';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from 'src/dtos/users/create-user.dto';

describe('UserController', () => {
  let userService: UserService;

  beforeEach(async () => {
    userService = new UserService(new UserRepository(new PrismaService()));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a user list successfully', async () => {
      const user: CreateUserDto = {
        name: 'generic-name',
        email: 'generic-email@email.com',
      };
      let created = await userService.create(user);
      const retorno = await userService.getAll();
      await userService.delete(created.id);

      expect(retorno).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(Number),
            name: 'generic-name',
            email: 'generic-email@email.com',
          },
        ])
      );
    });
  });
  describe('getById', () => {
    it('should return a single user successfully', async () => {
      const user: CreateUserDto = {
        name: 'generic-name',
        email: 'generic-email@email.com',
      };
      let created = await userService.create(user);
      const retorno = await userService.getById(created.id.toString());

      await userService.delete(created.id);

      expect(retorno).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: 'generic-name',
          email: 'generic-email@email.com',
        })
      );
    });
  });
  describe('create', () => {
    it('should return a user after creating successfully', async () => {
      const user: CreateUserDto = {
        name: 'generic-name',
        email: 'generic-email@email.com',
      };
      let retorno = await userService.create(user);
      await userService.delete(retorno.id);
      console.log(retorno);
      expect(retorno).toEqual({
        id: retorno.id,
        name: 'generic-name',
        email: 'generic-email@email.com',
      });
    });
  });
  describe('update', () => {
    it('should return a user after updating successfully', async () => {
      const user: CreateUserDto = {
        name: 'generic-name',
        email: 'generic-email@email.com',
      };
      const retorno = await userService.create(user);
      const updated = await userService.update(retorno.id.toString(), {
        name: 'updated-generic-name',
        email: 'updated-generic-email@email.com',
      });
      await userService.delete(updated.id);
      console.log(updated);
      expect(updated).toEqual({
        id: updated.id,
        name: 'updated-generic-name',
        email: 'updated-generic-email@email.com',
      });
    });
  });
  describe('delete', () => {
    it('should delete a user successfully', async () => {
      const user: CreateUserDto = {
        name: 'generic-name',
        email: 'generic-email@email.com',
      };
      const retorno = await userService.create(user);
      await userService.delete(retorno.id);

      expect(retorno).toEqual({
        id: retorno.id,
        name: retorno.name,
        email: retorno.email,
      });
    });
  });
});
