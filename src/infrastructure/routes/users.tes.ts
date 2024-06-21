import { faker } from '@faker-js/faker';
import request from 'supertest';
import { userSimpleData } from '../../domain/Types';
import { app } from '../app';
const superagent = require('superagent');

describe('Users API', () => {
  let userId1: string;
  let cookieUser1: string;
  let cookieUser2: string;
  let userId2: string;
  let user1AndUser2chatId: string;
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

  // let testSession: any;
  // let authenticatedSession: any;

  // beforeEach(function () {
  //   testSession = session(app);
  // });

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

  // describe('Test POST /login', () => {
  //   test('should respond with 201 success', async () => {
  //     const res = await request(app)
  //       .post('/v1/users/login')
  //       .send({ email: mockUser1.email, password: mockUser1.password })
  //       .expect(200);
  //   });
  // });

  describe('Auth request', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/v1/users/login')
        .send({ email: mockUser1.email, password: mockUser1.password })
        .expect(200);
    });
    describe('Test GET /contacts', () => {
      test('Should respond with 200 success', async () => {
        const res = await request(app)
          .get('/v1/users/contacts')
          .expect('Content-Type', /json/)
          .expect(200);
      });
    });
  });

  // describe('Test AUTH methods', () => {
  //   beforeEach(function (done) {
  //     testSession
  //       .post('/v1/users/login')
  //       .send({ email: mockUser1.email, password: mockUser1.password })
  //       .expect(200)
  //       .end(function (err: Error) {
  //         if (err) return done(err);
  //         authenticatedSession = testSession;
  //         return done();
  //       });
  //   });
  //   // describe('Test POST /login', () => {
  //   //   test('Should respond with 200 success', async () => {
  //   //     testSession
  //   //       .post('/v1/users/login')
  //   //       .send({ email: mockUser1.email, password: mockUser1.password })
  //   //       .expect(200)
  //   //       .end(function (err: any) {
  //   //         authenticatedSession = testSession;
  //   //       });
  //   //   });
  //   // });
  //   describe('Test GET /contacts', () => {
  //     test('Should respond with 200 success', async () => {
  //       authenticatedSession
  //         .get('/v1/users/contacts')
  //         .expect('Content-Type', /json/)
  //         .expect(200);
  //     });
  //   });

  //   describe('Test POST /user/new_contact', () => {
  //     test('Should respond with 201 success new contact added', async () => {
  //       authenticatedSession
  //         .post(`/v1/users/new_contact`)
  //         .send({
  //           alias: `${faker.person.firstName()}`,
  //           email: mockUser2.email,
  //         })
  //         .expect('Content-Type', /json/)
  //         .expect(201);
  //     });
  //   });
  // });

  // describe('Test POST /user/new_contact', () => {
  //   test('Should respond with 201 success new contact added', async () => {
  //     const response = await request(app)
  //       .post(`/v1/users/new_contact`)
  //       .send({
  //         alias: `${faker.person.firstName()}`,
  //         email: mockUser1.email,
  //       })
  //       .expect('Content-Type', /json/)
  //       .expect(201);
  //   });
  // });

  // describe('Test Get chats', () => {
  //   test('should return 200 success', async () => {
  //     const response = await request(app)
  //       .get('/v1/users/chats')
  //       .expect('Content-Type', /json/)
  //       .expect(201);
  //   });
  // });

  // describe('TEST GET /user/:id', () => {
  //   test('Should respond with 200 success', async () => {
  //     const response = await request(app)
  //       .get(`/v1/users/${id}`)
  //       .expect('Content-Type', /json/)
  //       .expect(200);
  //   });
  //   describe('TEST GET /user/wrong id', () => {
  //     test('Should respond with 500 error', async () => {
  //       const response = await request(app)
  //         .get(`/v1/users/errorid`)
  //         .expect(500);
  //     });
  //   });
  // });

  // describe('TEST POST /users/new_chat', () => {
  //   test('Should respond with 201 success new chat created', async () => {
  //     let members = [{ uid: userId1 }];
  //     const respond = await request(app)
  //       .post(`/v1/users/new_chat`)
  //       .send({ members })
  //       .expect('Content-Type', /json/)
  //       .expect(201)
  //       .then((res) => (user1AndUser2chatId = res.body.cid));
  //   });

  //   describe('TEST POST /users/new_msg', () => {
  //     test('should respond with 201  success msg sent', async () => {
  //       let messageMock = {
  //         chatId: user1AndUser2chatId,
  //         content: faker.lorem.sentence(3),
  //         type: 'TEXT',
  //       };
  //       const respond = await request(app)
  //         .post(`/v1/users/send_msg`)
  //         .send(messageMock)
  //         .expect('Content-Type', /json/)
  //         .expect(201);
  //     });
  //   });
  // });

  // describe('TEST GET /users/chat', () => {
  //   test('should respond with 200  success msg fetched', async () => {
  //     const respond = await request(app)
  //       .get(`/v1/users/chat`)
  //       .send({ chatId: user1AndUser2chatId })
  //       .expect('Content-Type', /json/)
  //       .expect(200);
  //   });
  // });

  // describe('TEST POST /users/auth', () => {
  //   test('should respond with 200 success', async () => {
  //     const response = await request(app)
  //       .post('/v1/users/logout')
  //       .expect('Content-Type', /json/)
  //       .expect(201);
  //   });

  //   test('should respond with 200 succed', async () => {
  //     const respond = await request(app)
  //       .post(`/v1/users/auth`)
  //       .send({ email: mockUser1.email, password: mockUser1.password })
  //       .expect('Content-Type', /json/)
  //       .expect(200);
  //   });
  // });

  // describe('Test DELETE /logout', () => {
  //   test('should respond with 200 success', async () => {
  //     const response = await request(app)
  //       .delete('/v1/users/logout')
  //       .expect('Content-Type', /json/)
  //       .expect(200);
  //   });
  // });
});
