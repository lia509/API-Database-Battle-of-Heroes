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
        await pool.query('INSERT INTO herois (nome, poder, nivel, hp) VALUES ($1, $2, $3, $4)', [nome, poder, nivel, hp]);
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
        await pool.query('UPDATE herois SET nome = $1, poder = $2, nivel = $3, hp = $4 WHERE id = $5', [nome, poder, nivel, hp, id])
        res.status(200).send({mensagem: 'heroi atualizado com sucesso'})
    } catch (error) {
        console.error('Erro ao atualizar', error);
        res.status(500).send('Erro ao atualizar');
    }
});


app.get('/herois/:id', async(req, res) => {
    try {
        const { id } = req. params;
        const resultado = await pool.query('SELECT * FROM herois WHERE id = $1', [id])
        if(resultado.rowCount == 0){
            res.status(404).send({mensagem: 'Id não encontrado'});
        }
        res.json({
            usuarios: resultado.rows[0],
        })
    } catch (error) {
        console.error('Erro ao pegar heroi por ID ', error);
        res.status(500).send('Erro ao pegar heroi por ID');
    }
});

app.get("/herois/nome/:nome", async (req, res) => {
    try {
      const { nome } = req.params;
      const { rows } = await pool.query("SELECT * FROM herois WHERE nome = $1", [
        nome,
      ]);
      res.status(200).send({
        message: "Herois encontrados com sucesso!",
        herois: rows,
      });
    } catch (error) {
      console.error("Erro ao buscar heroi", error);
      res.status(500).send("Erro ao buscar herois");
    }
  });

//   app.get("/herois/poder/:poder", async (req, res) => {
//     try {
//       const { poder } = req.params;
//       const { rows } = await pool.query("SELECT * FROM herois WHERE poder = $1", [
//         poder,
//       ]);
//       res.status(200).send({
//         message: "Herois encontrados com sucesso!",
//         herois: rows,
//       });
//     } catch (error) {
//       console.error("Erro ao buscar heroi", error);
//       res.status(500).send("Erro ao buscar heroi");
//     }
//   });


// ROTAS BATALHAS

app.get('/batalhas', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM batalhas');
        res.json({
            total: resultado.rowCount,
            batalhas: resultado.rows,
        });
    } catch (error) {
        console.error('Erro ao obter todas as batalhas', error);
        res.status(500).send('Erro ao obter as batalhas');
    }
});



app.get('/batalhas/:id/:id', async(req, res) => {
    try {
        const { id } = req. params;
        const resultado = await pool.query('SELECT herois.id AS Herois FROM herois INNER JOIN batalhas ON batalhas.heroi1_id = heroi2_id', [id])
        if(resultado.rowCount == 0){
            res.status(404).send({mensagem: 'Id não encontrado'});
        }
        res.json({
            batalhas: resultado.rows[0],
        })
    } catch (error) {
        console.error('Erro ao pegar batalhas por ID ', error);
        res.status(500).send('Erro ao pegar batalhas por ID');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} 🤯😤🤠🤬`);
});