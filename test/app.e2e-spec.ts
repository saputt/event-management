import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/main.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let userAccessToken: string
  let organizerAccessToken: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should login as a user and return accessToken', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "user@gmail.com",
        password: "user123"
      })

    expect(res.statusCode).toBe(200)
    expect(res.body.data.accessToken).toBeDefined()
    userAccessToken = res.body.data.accessToken
  });

  it('should access protect endpoint with a valid accessToken', async () => {
    const res = await request(app.getHttpServer())
      .get('/events')
      .set("Authorization", `Bearer ${userAccessToken}`)

    expect(res.statusCode).toBe(200)
  });

  it('should reject request without accessToken', async () => {
    const res = await request(app.getHttpServer())
      .get('/events')
    
    expect(res.statusCode).toBe(401)
  });

  it('should reject request to protect roles endpoint with a invalid roles', async () => {
    const res = await request(app.getHttpServer())
      .get('/events/da57f6c8-31f8-4bd0-a7cb-a48e0ff21b7d')
    
    expect(res.statusCode).toBe(401)
  });

  afterAll(async () => {
    await app.close();
  });
});
