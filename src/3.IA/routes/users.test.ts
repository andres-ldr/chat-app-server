import request from 'supertest';
import { app } from '../../4.F&D/app';
import { faker } from '@faker-js/faker';
import { userSimpleData } from '../../1.EBR/UserDTO';

describe('Users API', () => {
  let id: string;
  let id2: string;
  let chatId: string;
  const mockUser: userSimpleData = {
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    profileImage: '',
  };
  const mockIdNewContact: userSimpleData = {
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    profileImage: '',
  };

  describe('Test POST new /users', () => {
    test('Should respond with 201 success', async () => {
      const response = await request(app)
        .post('/v1/users')
        .send(mockUser)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((res) => (id = res.body.uid));

      const response2 = await request(app)
        .post('/v1/users')
        .send(mockIdNewContact)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((res) => (id2 = res.body.uid));
    });
  });

  describe('Test GET /contacts', () => {
    test('Should respond with 200 success', async () => {
      const response = await request(app)
        .get('/v1/users/contacts')
        .send({ uid: '518ef2e6-f3eb-4db3-9020-8392849ed824' })
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  describe('Test Get chats', () => {
    test('should return 200 success', async () => {
      const response = await request(app)
        .get('/v1/users/chats')
        .send({ uid: id })
        .expect('Content-Type', /json/)
        .expect(201);
    });
  });

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

  describe('Test POST /user/new_contact', () => {
    test('Should respond with 201 success new contact added', async () => {
      const respond = await request(app)
        .post(`/v1/users/new_contact`)
        .send({
          uid: `${id}`,
          alias: `${faker.person.firstName()}`,
          email: mockIdNewContact.email,
        })
        .expect('Content-Type', /json/)
        .expect(201);
    });
  });

  describe('TEST POST /users/new_chat', () => {
    test('Should respond with 201 success new chat created', async () => {
      let members = [{ uid: id }, { uid: id2 }];
      const respond = await request(app)
        .post(`/v1/users/new_chat`)
        .send({ alias: mockIdNewContact.name, members })
        .expect('Content-Type', /json/)
        .expect(201)
        .then((res) => (chatId = res.body.cid));
    });

    describe('TEST POST /users/new_msg', () => {
      test('should respond with 201  success msg sent', async () => {
        let messageMock = {
          chatId,
          content: faker.lorem.sentence(3),
          type: 'TEXT',
          senderId: id,
        };
        const respond = await request(app)
          .post(`/v1/users/send_msg`)
          .send(messageMock)
          .expect('Content-Type', /json/)
          .expect(201);
      });
    });
  });

  describe('TEST GET /users/chat', () => {
    test('should respond with 200  success msg fetched', async () => {
      const respond = await request(app)
        .get(`/v1/users/chat`)
        .send({ uid: id, chatId })
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });
});
