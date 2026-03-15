import request from 'supertest';
import { app } from '../../server';

// Setup MongoDB em memória
import '../setup';

describe('Draw API', () => {
  let authToken: string;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Teste Draw',
      email: 'draw@teste.com',
      password: 'Senha123!',
    });
    authToken = res.body.data.tokens.accessToken;
  });

  describe('POST /api/draw/numbers', () => {
    it('deve sortear números sem autenticação', async () => {
      const res = await request(app)
        .post('/api/draw/numbers')
        .send({ quantity: 5, min: 1, max: 100, allowRepeat: false });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.results).toHaveLength(5);
      res.body.data.results.forEach((n: number) => {
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(100);
      });
    });

    it('deve gerar números sem repetição', async () => {
      const res = await request(app)
        .post('/api/draw/numbers')
        .send({ quantity: 10, min: 1, max: 10, allowRepeat: false });

      expect(res.status).toBe(200);
      const results = res.body.data.results;
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBe(10);
    });

    it('deve rejeitar quantidade maior que intervalo sem repetição', async () => {
      const res = await request(app)
        .post('/api/draw/numbers')
        .send({ quantity: 20, min: 1, max: 10, allowRepeat: false });

      expect(res.status).toBe(400);
    });

    it('deve permitir repetição', async () => {
      const res = await request(app)
        .post('/api/draw/numbers')
        .send({ quantity: 50, min: 1, max: 5, allowRepeat: true });

      expect(res.status).toBe(200);
      expect(res.body.data.results).toHaveLength(50);
    });

    it('deve rejeitar min >= max', async () => {
      const res = await request(app)
        .post('/api/draw/numbers')
        .send({ quantity: 1, min: 100, max: 1, allowRepeat: false });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/draw/names', () => {
    const names = ['Alice', 'Bob', 'Carlos', 'Diana', 'Eduardo'];

    it('deve sortear nomes', async () => {
      const res = await request(app)
        .post('/api/draw/names')
        .send({ quantity: 2, names, allowRepeat: false });

      expect(res.status).toBe(200);
      expect(res.body.data.results).toHaveLength(2);
      res.body.data.results.forEach((name: string) => {
        expect(names).toContain(name);
      });
    });

    it('deve sortear sem repetição', async () => {
      const res = await request(app)
        .post('/api/draw/names')
        .send({ quantity: 5, names, allowRepeat: false });

      expect(res.status).toBe(200);
      const uniqueResults = new Set(res.body.data.results);
      expect(uniqueResults.size).toBe(5);
    });

    it('deve rejeitar lista vazia', async () => {
      const res = await request(app)
        .post('/api/draw/names')
        .send({ quantity: 1, names: [], allowRepeat: false });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/draw/roulette', () => {
    it('deve sortear na roleta', async () => {
      const res = await request(app)
        .post('/api/draw/roulette')
        .send({
          entries: ['Brasil', 'Argentina', 'Chile', 'Peru'],
          colors: ['#FF0000', '#00FF00', '#0000FF'],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.winner).toBeDefined();
      expect(res.body.data.angle).toBeDefined();
      expect(res.body.data.winnerIndex).toBeDefined();
    });

    it('deve rejeitar menos de 2 entradas', async () => {
      const res = await request(app)
        .post('/api/draw/roulette')
        .send({
          entries: ['Apenas Um'],
          colors: ['#FF0000'],
        });

      expect(res.status).toBe(400);
    });

    it('deve rejeitar cor inválida', async () => {
      const res = await request(app)
        .post('/api/draw/roulette')
        .send({
          entries: ['A', 'B'],
          colors: ['invalido'],
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/draw/history', () => {
    it('deve retornar histórico para usuário autenticado', async () => {
      // Fazer um sorteio autenticado primeiro
      await request(app)
        .post('/api/draw/numbers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 1, min: 1, max: 10, allowRepeat: false });

      const res = await request(app)
        .get('/api/draw/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.results).toHaveLength(1);
      expect(res.body.data.pagination).toBeDefined();
    });

    it('deve rejeitar sem autenticação', async () => {
      const res = await request(app).get('/api/draw/history');
      expect(res.status).toBe(401);
    });
  });
});
