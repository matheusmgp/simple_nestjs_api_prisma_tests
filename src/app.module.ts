import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from './services/prisma.service';
import { HttpCustomResponse } from './response/http-custom-response';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService, HttpCustomResponse],
})
export class AppModule {}
