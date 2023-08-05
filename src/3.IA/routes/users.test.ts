import request from 'supertest';
import { app } from '../../4.F&D/app';
import { userSimpleData } from '../../1.EBR/UserDTO';

describe('Users API', () => {
  let id: number;
  let id2: number;
  let chatId: string;
  const mockUser: userSimpleData = {
    name: 'John Doe',
    last_name: 'Perez',
    email: 'mail@mail.com',
    profile_image: '',
  };
  const mockIdNewContact: userSimpleData = {
    name: 'Frank',
    last_name: 'Doe',
    email: '1mail@mail.com',
    profile_image: '',
  };

  describe('Test GET /users', () => {
    test('Should respond with 200 success', async () => {
      const response = await request(app)
        .get('/v1/users')
        .expect('Content-Type', /json/) //lokk headers
        .expect(200);
    });
  });

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

  describe('TEST GET /user/:id', () => {
    test('Should respond with 200 success', async () => {
      const response = await request(app)
        .get(`/v1/users/${id}`)
        .expect('Content-Type', /json/)
        .expect(200);
    });
    describe('TEST GET /user/wrong id', () => {
      test('Should respond with 500 error', async () => {
        const response = await request(app)
          .get(`/v1/users/errorid`)
          .expect(500);
      });
    });
  });

  describe('Test POST /user/:id/new_contact', () => {
    test('Should respond with 201 success new contact added', async () => {
      const respond = await request(app)
        .post(`/v1/users/${id}/new_contact`)
        .send({ email: mockIdNewContact.email })
        .expect('Content-Type', /json/)
        .expect(201);
    });
  });

  describe('TEST POST /users/:id/new_chat', () => {
    test('Should respond with 201 success new chat created', async () => {
      const respond = await request(app)
        .post(`/v1/users/${id}/new_chat`)
        .send({ contactId: id2 })
        .expect('Content-Type', /json/)
        .expect(201)
        .then((res) => (chatId = res.body.cid));
    });
  });

  describe('TEST POST /users/:id/new_msg', () => {
    test('should respond with 201  success msg sent', async () => {
      const respond = await request(app)
        .post(`/v1/users/${id}/send_msg`)
        .send({ content: 'Hola', chat: `${chatId}` })
        .expect('Content-Type', /json/)
        .expect(201);
    });
  });
});
