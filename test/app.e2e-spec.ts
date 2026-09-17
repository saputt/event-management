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

  it('[user] should login as a user and return accessToken', async () => {
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

  it('[user] should access protect endpoint with a valid accessToken', async () => {
    const res = await request(app.getHttpServer())
      .get('/events')
      .set("Authorization", `Bearer ${userAccessToken}`)

    expect(res.statusCode).toBe(200)
  });

  it('[user] should reject request without accessToken', async () => {
    const res = await request(app.getHttpServer())
      .get('/events')
    
    expect(res.statusCode).toBe(401)
  });

  it('[user] should reject request to protect roles endpoint with a invalid roles', async () => {
    const res = await request(app.getHttpServer())
      .get('/organizers/me')
      .set("Authorization", `Bearer ${userAccessToken}`)
    
    expect(res.statusCode).toBe(403)
  });

    it('[organizer] should login as a user and return accessToken', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "organizer@gmail.com",
        password: "organizer123"
      })

    expect(res.statusCode).toBe(200)
    expect(res.body.data.accessToken).toBeDefined()
    organizerAccessToken = res.body.data.accessToken
  });

  it('[organizer] should access protect endpoint with a valid accessToken', async () => {
    const res = await request(app.getHttpServer())
      .get('/organizers/me')
      .set("Authorization", `Bearer ${organizerAccessToken}`)
    console.log(res)
    expect(res.statusCode).toBe(200)
  });

  it('[organizer] should reject request without accessToken', async () => {
    const res = await request(app.getHttpServer())
      .get('/organizers/me')

    expect(res.statusCode).toBe(401)
  });

  it('[organizer] should reject request to protect roles endpoint with a invalid roles', async () => {
    const res = await request(app.getHttpServer())
      .get('/events')
      .set("Authorization", `Bearer ${organizerAccessToken}`)

    expect(res.statusCode).toBe(403)
  });

  afterAll(async () => {
    await app.close();
  });
});
