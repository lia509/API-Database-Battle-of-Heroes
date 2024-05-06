const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3090;


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'batalha_herois',
    password: 'ds564',
    port: 7007,
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('ta funfando');
})

app.get('/herois', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM herois');
        res.json({
            total: resultado.rowCount,
            herois: resultado.rows,
        });
    } catch (error) {
        console.error('Erro ao obter todos os herois', error);
        res.status(500).send('Erro ao obter os herois');
    }
});

app.post('/herois',async (req, res) => {
    try {
        const {nome, poder, nivel, hp} = req.body;
        await pool.query('INSERT INTO herois (nome, poder, nivel, hp) VALUES ($1, $2, $3, %4)', [nome, poder, nivel, hp]);
        res.status(201).send({mensagem: 'Heros criado com sucesso'});
    } catch (error) {
        console.error('Erro ao criar heroi', error);
        res.status(500).send('Erro ao criar heroi');
    }
});

app.delete('/herois/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const resultado = await pool.query('DELETE FROM herois WHERE id = $1', [id]);
        res.status(200).send({mensagem: 'heroi deletado com sucesso'})
    } catch (error) {
        console.error('Erro ao apagar heois', error);
        res.status(500).send('Erro ao apagar o heroi');
    }
});

app.put('/herois/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, poder, nivel, hp } = req.body;
        await pool.query('UPDATE herois SET nome = $1, poder = $2 nivel = $3 WHERE id = $3', [nome, poder, nivel, hp])
        res.status(200).send({mensagem: 'heroi atualizado com sucesso'})
    } catch (error) {
        console.error('Erro ao atualizar', error);
        res.status(500).send('Erro ao atualizar');
    }
});