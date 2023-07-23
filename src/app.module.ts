import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './controllers/user.controller';
import { IUserService, UserService } from './services/user.service';
import { IUserRepository, UserRepository } from './repositories/user.repository';
import { IPrismaService, PrismaService } from './services/prisma.service';
import { IHttpCustomResponse, HttpCustomResponse } from './response/http-custom-response';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [
    {
      provide: IUserService,
      useClass: UserService,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IPrismaService,
      useClass: PrismaService,
    },
    {
      provide: IHttpCustomResponse,
      useClass: HttpCustomResponse,
    },
    UserService,
    UserRepository,
    PrismaService,
    HttpCustomResponse,
  ],
})
export class AppModule {}
