// __tests__/server.test.js
import request from 'supertest';
import server from '../src/index.ts'; // Импортируем ваше приложение

describe('GET /api/users', () => {
    it('должен вернуть объект с сообщением', async () => {
        const response = await request(server).get('/api/users');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});

