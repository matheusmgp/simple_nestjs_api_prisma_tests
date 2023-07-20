import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/services/user.service';
import { UserRepository } from '../src/repositories/user.repository';
import { PrismaService } from '../src/services/prisma.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeEach(async () => {
    userService = new UserService(new UserRepository(new PrismaService()));
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it(`/GET users`, async () => {
    const user: any = {
      name: 'generic-name',
      email: 'generic-email@email.com',
    };
    let created = await userService.create(user);

    const req = await request(app.getHttpServer()).get('/users');
    expect(req.statusCode);
    expect(req.body).toEqual(
      expect.objectContaining({
        statusCode: 200,
        data: [
          {
            id: expect.any(Number),
            email: 'generic-email@email.com',
            name: 'generic-name',
          },
        ],
        timestamp: expect.any(String),
        message: ['success'],
        method: 'GET',
      })
    );

    await userService.delete(created.id.toString());
  });
  it(`/GET users EMPTY LIST NOTFOUNDEXCEPTION`, async () => {
    const req = await request(app.getHttpServer()).get('/users');
    expect(req.statusCode);
    expect(req.body).toEqual({
      statusCode: 404,
      message: ['no records found'],
      error: 'Not Found',
    });
  });
  it(`/GETBYID user`, async () => {
    const user: any = {
      name: 'generic-name',
      email: 'generic-email@email.com',
    };
    let created = await userService.create(user);

    const req = await request(app.getHttpServer()).get(`/users/${created.id}`);
    expect(req.statusCode);
    expect(req.body).toEqual(
      expect.objectContaining({
        statusCode: 200,
        data: {
          id: expect.any(Number),
          email: 'generic-email@email.com',
          name: 'generic-name',
        },
        timestamp: expect.any(String),
        message: ['success'],
        method: 'GET',
      })
    );

    await userService.delete(created.id.toString());
  });
  it(`/GETBYID user NOTFOUNDEXCEMPTION`, async () => {
    const FAKE_ID = '1212';

    const req = await request(app.getHttpServer()).get(`/users/${FAKE_ID}`);
    expect(req.statusCode);
    expect(req.body).toEqual({
      statusCode: 404,
      message: [`Usuario ${FAKE_ID} não encontrado.`],
      error: 'Not Found',
    });
  });
  it(`/UPDATE user`, async () => {
    const user: any = {
      name: 'generic-name',
      email: 'generic-email@email.com',
    };

    let created = await userService.create(user);
    const newUser: any = {
      name: 'updated',
      email: 'updated@email.com',
    };

    const req = await request(app.getHttpServer())
      .put(`/users/${created.id}`)
      .set('Accept', 'application/json')
      .send(newUser);

    expect(req.statusCode);
    expect(req.body).toEqual(
      expect.objectContaining({
        statusCode: 200,
        data: {
          id: expect.any(Number),
          email: newUser.email,
          name: newUser.name,
        },
        timestamp: expect.any(String),
        message: ['success'],
        method: 'PUT',
      })
    );

    await userService.delete(created.id.toString());
  });
  it(`/UPDATE user NOTFOUNDEXCEMPTION`, async () => {
    const FAKE_ID = '1212';
    const newUser: any = {
      name: 'updated',
      email: 'updated@email.com',
    };

    const req = await request(app.getHttpServer())
      .put(`/users/${FAKE_ID}`)
      .set('Accept', 'application/json')
      .send(newUser);
    expect(req.statusCode);
    expect(req.body).toEqual({
      statusCode: 404,
      message: [`Usuario ${FAKE_ID} não encontrado.`],
      error: 'Not Found',
    });
  });
  it(`/CREATE user`, async () => {
    const user: any = {
      name: 'generic-name',
      email: 'generic-email@email.com',
    };

    const req = await request(app.getHttpServer()).post(`/users`).set('Accept', 'application/json').send(user);

    expect(req.statusCode);
    expect(req.body).toEqual(
      expect.objectContaining({
        statusCode: 201,
        data: {
          id: expect.any(Number),
          email: user.email,
          name: user.name,
        },
        timestamp: expect.any(String),
        message: ['success'],
        method: 'POST',
      })
    );

    await userService.deleteAll();
  });
  it(`/CREATE user empty fields`, async () => {
    const user: any = {
      name: '',
      email: '',
    };
    const req = await request(app.getHttpServer()).post(`/users`).set('Accept', 'application/json').send(user);
    expect(req.statusCode);
    expect(req.body).toEqual({
      statusCode: 400,
      message: ['Campo Nome é obrigatório', 'email must be an email', 'Campo Email é obrigatório'],
      error: 'Bad Request',
    });
  });
});
