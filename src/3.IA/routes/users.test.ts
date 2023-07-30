import request from 'supertest';
import { app } from '../../4.F&D/app';
import { userSimpleData } from '../../1.EBR/user.value';

describe('Users API', () => {
  describe('Test GET /users', () => {
    test('Should respond with 200 success', async () => {
      const response = await request(app)
        .get('/v1/users')
        .expect('Content-Type', /json/) //lokk headers
        .expect(200);
    });
  });

  describe('Test POST /users', () => {
    const mockUser: userSimpleData = {
      name: 'PEEP',
      last_name: 'Perez',
      email: 'mail@mail.com',
      profile_image: '',
    };

    test('Should respond with 201 success', async () => {
      const response = await request(app)
        .post('/v1/users')
        .send(mockUser)
        .expect('Content-Type', /json/)
        .expect(201);
    });
  });
});
