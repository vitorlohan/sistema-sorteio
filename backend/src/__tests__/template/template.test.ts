import request from 'supertest';
import { app } from '../../server';

// Setup MongoDB em memória
import '../setup';

describe('Template API', () => {
  let authToken: string;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Teste Template',
      email: 'template@teste.com',
      password: 'Senha123!',
    });
    authToken = res.body.data.tokens.accessToken;
  });

  const numberTemplate = {
    name: 'Mega Sena',
    type: 'number',
    config: {
      quantity: 6,
      min: 1,
      max: 60,
      allowRepeat: false,
    },
  };

  const nameTemplate = {
    name: 'Sorteio Equipe',
    type: 'name',
    config: {
      quantity: 1,
      names: ['Alice', 'Bob', 'Carlos'],
      allowRepeat: false,
    },
  };

  describe('POST /api/templates', () => {
    it('deve criar um template de números', async () => {
      const res = await request(app)
        .post('/api/templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send(numberTemplate);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.template.name).toBe(numberTemplate.name);
    });

    it('deve criar um template de nomes', async () => {
      const res = await request(app)
        .post('/api/templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send(nameTemplate);

      expect(res.status).toBe(201);
      expect(res.body.data.template.type).toBe('name');
    });

    it('deve rejeitar sem autenticação', async () => {
      const res = await request(app)
        .post('/api/templates')
        .send(numberTemplate);

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/templates', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send(numberTemplate);
      await request(app)
        .post('/api/templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send(nameTemplate);
    });

    it('deve listar todos os templates do usuário', async () => {
      const res = await request(app)
        .get('/api/templates')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.templates).toHaveLength(2);
    });

    it('deve filtrar por tipo', async () => {
      const res = await request(app)
        .get('/api/templates?type=number')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.templates).toHaveLength(1);
      expect(res.body.data.templates[0].type).toBe('number');
    });
  });

  describe('PUT /api/templates/:id', () => {
    it('deve atualizar um template', async () => {
      const createRes = await request(app)
        .post('/api/templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send(numberTemplate);

      const id = createRes.body.data.template._id;

      const res = await request(app)
        .put(`/api/templates/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Quina' });

      expect(res.status).toBe(200);
      expect(res.body.data.template.name).toBe('Quina');
    });
  });

  describe('DELETE /api/templates/:id', () => {
    it('deve excluir um template', async () => {
      const createRes = await request(app)
        .post('/api/templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send(numberTemplate);

      const id = createRes.body.data.template._id;

      const res = await request(app)
        .delete(`/api/templates/${id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);

      // Verificar que foi excluído
      const getRes = await request(app)
        .get(`/api/templates/${id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getRes.status).toBe(404);
    });
  });
});
