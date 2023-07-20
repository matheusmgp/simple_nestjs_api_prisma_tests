import { Controller, Get, Param, Query, Post, Body, Put, Delete } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from '../dtos/users/create-user.dto';
import { UpdateUserDto } from '../dtos/users/update-user.dto';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<any> {
    return this.userService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<any> {
    return this.userService.getById(id);
  }

  @Post()
  async create(@Body() postData: CreateUserDto): Promise<any> {
    return this.userService.create(postData);
  }

  @Put(':id')
  async put(@Param('id') id: string, @Body() data: UpdateUserDto): Promise<any> {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<any> {
    return this.userService.delete(Number(id));
  }
}
