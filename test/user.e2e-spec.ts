import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/services/user.service';
import { IUserRepository } from '../src/repositories/user.repository';
import { CreateUserDto } from '../src/dtos/users/create-user.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let userRepository: IUserRepository;
  const FAKE_ID = '999';
  const GENERIC_USER: CreateUserDto = {
    name: 'generic-name',
    email: 'generic-email@email.com',
  };
  beforeEach(async () => {
    await userService.deleteAll();
  });
  afterEach(async () => {
    await userService.deleteAll();
  });
  beforeAll(async () => {
    userService = new UserService(userRepository);
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: UserService,
          useValue: {
            getById: jest.fn(),
            getAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deleteAll: jest.fn(),
          },
        },
      ],
    }).compile();
    userService = moduleRef.get<UserService>(UserService);
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it(`/GET users`, async () => {
    await userService.create(GENERIC_USER);
    const req = await request(app.getHttpServer()).get('/users');
    expect(req.statusCode).toBe(200);
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
  });
  it(`/GET users empty list []`, async () => {
    const req = await request(app.getHttpServer()).get('/users');
    expect(req.statusCode).toBe(404);
    expect(req.body).toEqual({
      statusCode: 404,
      message: ['no records found'],
      error: 'Not Found',
    });
  });
  it(`/GETBYID user`, async () => {
    let created = await userService.create(GENERIC_USER);
    const req = await request(app.getHttpServer()).get(`/users/${created.id}`);
    expect(req.statusCode).toBe(200);
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
  });
  it(`/GETBYID user NotFoundException`, async () => {
    const req = await request(app.getHttpServer()).get(`/users/${FAKE_ID}`);
    expect(req.statusCode).toBe(404);
    expect(req.body).toEqual({
      statusCode: 404,
      message: [`Usuario ${FAKE_ID} não encontrado.`],
      error: 'Not Found',
    });
  });
  it(`/UPDATE user`, async () => {
    let created = await userService.create(GENERIC_USER);
    const newUser: any = {
      name: 'updated',
      email: 'updated@email.com',
    };

    const req = await request(app.getHttpServer())
      .put(`/users/${created.id}`)
      .set('Accept', 'application/json')
      .send(newUser);

    expect(req.statusCode).toBe(200);
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
  });
  it(`/UPDATE user NotFoundException`, async () => {
    const req = await request(app.getHttpServer())
      .put(`/users/${FAKE_ID}`)
      .set('Accept', 'application/json')
      .send(GENERIC_USER);
    expect(req.statusCode).toBe(404);
    expect(req.body).toEqual({
      statusCode: 404,
      message: [`Usuario ${FAKE_ID} não encontrado.`],
      error: 'Not Found',
    });
  });
  it(`/CREATE user`, async () => {
    const req = await request(app.getHttpServer()).post(`/users`).set('Accept', 'application/json').send(GENERIC_USER);
    expect(req.statusCode).toBe(201);
    expect(req.body).toEqual(
      expect.objectContaining({
        statusCode: 201,
        data: {
          id: expect.any(Number),
          email: GENERIC_USER.email,
          name: GENERIC_USER.name,
        },
        timestamp: expect.any(String),
        message: ['success'],
        method: 'POST',
      })
    );
  });
  it(`/CREATE user with empty fields`, async () => {
    const req = await request(app.getHttpServer()).post(`/users`).set('Accept', 'application/json').send({
      name: '',
      email: '',
    });
    expect(req.statusCode).toBe(400);
    expect(req.body).toEqual({
      statusCode: 400,
      message: ['Campo Nome é obrigatório', 'email must be an email', 'Campo Email é obrigatório'],
      error: 'Bad Request',
    });
  });
});
