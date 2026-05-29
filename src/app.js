const express = require('express');
const cors = require('cors');
const db = require('./db');
const xlsx = require('xlsx');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/pacientes', (req, res) => {
    const { nome_completo, whatsapp } = req.body;
    if (!nome_completo || !whatsapp) return res.status(400).json({ erro: 'Faltam dados.' });

    db.run(`INSERT INTO pacientes (nome_completo, whatsapp) VALUES (?, ?)`, [nome_completo, whatsapp], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ id: this.lastID, nome_completo, whatsapp });
    });
});

app.get('/api/pacientes', (req, res) => {
    db.all(`SELECT * FROM pacientes`, [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json(rows);
    });
});

app.put('/api/pacientes/:id', (req, res) => {
    const { nome_completo, whatsapp } = req.body;
    db.run(`UPDATE pacientes SET nome_completo = ?, whatsapp = ? WHERE id = ?`, [nome_completo, whatsapp, req.params.id], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json({ mensagem: 'Atualizado!' });
    });
});

app.delete('/api/pacientes/:id', (req, res) => {
    db.run(`DELETE FROM pacientes WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json({ mensagem: 'Removido!' });
    });
});

app.get('/api/pacientes/exportar', (req, res) => {
    db.all(`SELECT * FROM pacientes`, [], (err, rows) => {
        if (err || rows.length === 0) return res.status(404).send('Erro ou sem dados.');
        
        const worksheet = xlsx.utils.json_to_sheet(rows);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Pacientes");
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename="Relatorio_Pacientes.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    });
});

module.exports = app;
