import { faker } from '@faker-js/faker';
import superagent from 'superagent';
import request from 'supertest';
import { userSimpleData } from '../../domain/Types';
import { app } from '../app';
var user1 = superagent.agent();

describe('Users API', () => {
  let cookie: object;
  const mockUser1: userSimpleData = {
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    profileImage: '',
  };
  const mockUser2: userSimpleData = {
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    profileImage: '',
  };

  describe('Test POST new /users', () => {
    test('Should respond with 201 success', async () => {
      const response1 = await request(app)
        .post('/v1/users/new_user')
        .send(mockUser1)
        .expect('Content-Type', /json/)
        .expect(201);
      const response2 = await request(app)
        .post('/v1/users/new_user')
        .send(mockUser2)
        .expect('Content-Type', /json/)
        .expect(201);
    });
  });

  describe('Test POST /login', () => {
    test('should respond 201 log in', async () => {
      const res = request(app)
        .post('/v1/users/login')
        .send({ email: mockUser1.email, password: mockUser1.password })
        //.set('Content-Type', 'application/x-www-form-urlencoded');
        .expect('Content-Type', /json/)
        .expect(201)
        .end((res) => {
          cookie = res.headers['set-cookie'];
          console.log(cookie);
        });
    });
  });

  // describe('Test GET /contacts', () => {
  //   test('Should respond with 200 success', () => {
  //     const res = request(app)
  //       .get('/v1/users/contacts')
  //       .set('Cookie', cookie.passport)
  //       .expect('Content-Type', /json/)
  //       .expect(200);
  //   });
  // });

  // describe('Test POST /user/new_contact', () => {
  //   test('Should respond with 201 success new contact added', async () => {
  //     user1.post(`/v1/users/new_contact`).send({
  //       alias: `${faker.person.firstName()}`,
  //       email: mockUser2.email,
  //     });
  //     // .expect('Content-Type', /json/)
  //     // .expect(201);
  //   });
  // });
});
