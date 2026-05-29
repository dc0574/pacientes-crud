const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

describe('Testes da API de Pacientes', () => {
    let pacienteId;

    it('1. Cadastrar paciente', async () => {
        const res = await request(app).post('/api/pacientes').send({ nome_completo: 'Teste', whatsapp: '2190' });
        assert.strictEqual(res.statusCode, 201);
        pacienteId = res.body.id; 
    });

    it('2. Listar pacientes', async () => {
        const res = await request(app).get('/api/pacientes');
        assert.strictEqual(res.statusCode, 200);
    });

    it('3. Atualizar paciente', async () => {
        const res = await request(app).put(`/api/pacientes/${pacienteId}`).send({ nome_completo: 'Teste2', whatsapp: '2191' });
        assert.strictEqual(res.statusCode, 200);
    });

    it('4. Excluir paciente', async () => {
        const res = await request(app).delete(`/api/pacientes/${pacienteId}`);
        assert.strictEqual(res.statusCode, 200);
    });
});
