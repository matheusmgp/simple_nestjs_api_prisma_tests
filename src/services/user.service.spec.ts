import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from './prisma.service';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from 'src/dtos/users/create-user.dto';
import { NOTFOUND } from 'dns';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  const FAKE_ID = '999';
  const FAKE_DATA = {
    name: 'fake',
    email: 'fake@mail.com',
  };
  const GENERIC_USER: CreateUserDto = {
    name: 'generic-name',
    email: 'generic-email@email.com',
  };
  beforeEach(async () => {
    await userService.deleteAll();
  });
  beforeAll(async () => {
    userService = new UserService(new UserRepository(new PrismaService()));
  });
  afterEach(async () => {
    await userService.deleteAll();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a user list successfully', async () => {
      await userService.create(GENERIC_USER);
      const retorno = await userService.getAll();
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
    it('should return a empty list', async () => {
      const retorno = await userService.getAll();
      expect(retorno).toEqual([]);
    });
  });
  describe('getById', () => {
    it('should return a single user successfully', async () => {
      let created = await userService.create(GENERIC_USER);
      const retorno = await userService.getById(created.id.toString());
      expect(retorno).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: 'generic-name',
          email: 'generic-email@email.com',
        })
      );
    });
    it('should return a NotFoundException', async () => {
      await expect(userService.getById(FAKE_ID)).rejects.toThrow(NotFoundException);
    });
  });
  describe('create', () => {
    it('should create a user successfully', async () => {
      let retorno = await userService.create(GENERIC_USER);
      expect(retorno).toEqual({
        id: retorno.id,
        name: 'generic-name',
        email: 'generic-email@email.com',
      });
    });
  });
  describe('update', () => {
    it('should update a user successfully', async () => {
      const retorno = await userService.create(GENERIC_USER);
      const updated = await userService.update(retorno.id.toString(), {
        name: 'updated-generic-name',
        email: 'updated-generic-email@email.com',
      });

      expect(updated).toEqual({
        id: updated.id,
        name: 'updated-generic-name',
        email: 'updated-generic-email@email.com',
      });
    });
    it('should return a NotFoundException', async () => {
      await expect(userService.update(FAKE_ID, FAKE_DATA)).rejects.toThrow(NotFoundException);
    });
  });
  describe('delete', () => {
    it('should delete a user successfully', async () => {
      const retorno = await userService.create(GENERIC_USER);
      expect(retorno).toEqual({
        id: retorno.id,
        name: retorno.name,
        email: retorno.email,
      });
    });
    it('should return a NotFoundException', async () => {
      await expect(userService.delete(FAKE_ID)).rejects.toThrow(NotFoundException);
    });
  });
});
