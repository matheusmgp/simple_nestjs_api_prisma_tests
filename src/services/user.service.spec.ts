import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from './prisma.service';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from 'src/dtos/users/create-user.dto';
import { NOTFOUND } from 'dns';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
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
      console.log(retorno);
      await userService.delete(created.id.toString());

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
    it('should return a empty array', async () => {
      const retorno = await userService.getAll();
      expect(retorno).toEqual([]);
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

      await userService.delete(created.id.toString());

      expect(retorno).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: 'generic-name',
          email: 'generic-email@email.com',
        })
      );
    });
    it('should return a NotFoundException', async () => {
      const FAKE_ID = '121212';
      await expect(userService.getById(FAKE_ID)).rejects.toThrow(NotFoundException);
    });
  });
  describe('create', () => {
    it('should return a user after creating successfully', async () => {
      const user: CreateUserDto = {
        name: 'generic-name',
        email: 'generic-email@email.com',
      };
      let retorno = await userService.create(user);
      await userService.delete(retorno.id.toString());
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
      await userService.delete(updated.id.toString());
      console.log(updated);
      expect(updated).toEqual({
        id: updated.id,
        name: 'updated-generic-name',
        email: 'updated-generic-email@email.com',
      });
    });
    it('should return a NotFoundException', async () => {
      const FAKE_ID = '121212';
      const FAKE_DATA = {
        name: 'fake',
        email: 'fake@mail.com',
      };
      await expect(userService.update(FAKE_ID, FAKE_DATA)).rejects.toThrow(NotFoundException);
    });
  });
  describe('delete', () => {
    it('should delete a user successfully', async () => {
      const user: CreateUserDto = {
        name: 'generic-name',
        email: 'generic-email@email.com',
      };
      const retorno = await userService.create(user);
      await userService.delete(retorno.id.toString());

      expect(retorno).toEqual({
        id: retorno.id,
        name: retorno.name,
        email: retorno.email,
      });
    });
    it('should return a NotFoundException', async () => {
      const FAKE_ID = '121212';
      const FAKE_DATA = {
        name: 'fake',
        email: 'fake@mail.com',
      };
      await expect(userService.delete(FAKE_ID)).rejects.toThrow(NotFoundException);
    });
  });
});
