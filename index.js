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

app.post('/herois', async (req, res) => {
    try {
        const { nome, poder, nivel, hp } = req.body;

        let poderes = ["Teletransporte", "Sentidos Aprimorados", "Fator de Cura Acelerado", "Transmorfismo Corporal"];
        if (!poderes.includes(poder)) {
            res.status(500).send('O poder precisa ser: Teletransporte, Sentidos Aprimorados, Fator de Cura Acelerado ou Transmorfismo Corporal.');
        } else {
            await pool.query('INSERT INTO herois (nome, poder, nivel, hp) VALUES ($1, $2, $3, $4)', [nome, poder, nivel, hp]);
            res.status(201).send({ mensagem: 'Heros criado com sucesso' });
        }


    } catch (error) {
        console.error('Erro ao criar heroi', error);
        res.status(500).send('Erro ao criar heroi');
    }
});

app.delete('/herois/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('DELETE FROM herois WHERE id = $1', [id]);
        res.status(200).send({ mensagem: 'heroi deletado com sucesso' })
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
        res.status(200).send({ mensagem: 'heroi atualizado com sucesso' })
    } catch (error) {
        console.error('Erro ao atualizar', error);
        res.status(500).send('Erro ao atualizar');
    }
});


app.get('/herois/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('SELECT * FROM herois WHERE id = $1', [id])
        if (resultado.rowCount == 0) {
            res.status(404).send({ mensagem: 'Id não encontrado' });
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

app.get("/herois/poder/:poder", async (req, res) => {
    try {
        const { poder } = req.params;
        const { rows } = await pool.query("SELECT * FROM herois WHERE poder = $1", [
            poder,
        ]);
        res.status(200).send({
            message: "Herois encontrados com sucesso!",
            herois: rows,
        });
    } catch (error) {
        console.error("Erro ao buscar heroi", error);
        res.status(500).send("Erro ao buscar heroi");
    }
});


// ROTAS BATALHAS

app.get('/batalhas/:idHeroi1/:idHeroi2', async (req, res) => {
    try {
        const { idHeroi1, idHeroi2 } = req.params;

        const vencedorId = await calcularVencedor(idHeroi1, idHeroi2);

        // Insere o registro da batalha na tabela battles
        await pool.query('INSERT INTO batalhas (heroi1_id, heroi2_id, vencedor_id) VALUES ($1, $2, $3)', [idHeroi1, idHeroi2, vencedorId]);

        const { rows } = await pool.query('SELECT * FROM herois WHERE id = $1', [vencedorId]);
        res.json({ vencedor: rows[0], message: 'Batalha registrada com sucesso!' });
        
    } catch (error) {
        console.error("Erro ao registrar batalha", error);
        res.status(500).send("Erro ao registrar batalha");
    }
});


async function calcularVencedor(heroi1Id, heroi2Id) {
    const heroi1 = await pool.query('SELECT * FROM herois WHERE id = $1', [heroi1Id]);
    const heroi2 = await pool.query('SELECT * FROM herois WHERE id = $1', [heroi2Id]);

    let poderes = ["Teletransporte", "Sentidos Aprimorados", "Fator de Cura Acelerado", "Transmorfismo Corporal"];
    //maior level ganha


    if (heroi1Id === poderes[0] && heroi2Id === poderes[1]) {
        return heroi2Id;
    } else if (heroi1Id === poderes[0] && heroi2Id === poderes[2]){
        return heroi1Id;
    }else if (heroi1Id === poderes[0] && heroi2Id === poderes[3]){
        return heroi2Id;
    
    }else if (heroi1Id === poderes[1] && heroi2Id === poderes[0]){
        return heroi1Id;
    }else if (heroi1 === poderes[1] && heroi2Id === poderes[2]){
        return heroi1Id;
    }else if (heroi1Id === poderes[1] && heroi2Id === poderes[3]){
        return heroi1Id;
    
    }else if (heroi1Id === poderes[2] && heroi2Id === poderes[0]){
        return heroi2Id;
    }else if (heroi1Id === poderes[2] && heroi2Id === poderes[1]){
        return heroi2Id;
    }else if (heroi1Id === poderes[2] && heroi2Id === poderes[3]){
        return heroi2Id;
    
    }else if (heroi1Id === poderes[3] && heroi2Id === poderes[0]){
        return heroi1Id;
    }else if (heroi1Id === poderes[3] && heroi2Id === poderes[1]){
        return heroi2Id;
    }else if (heroi1Id === poderes[3] && heroiId2 === poderes[2]){
        return heroi1Id;
    } else {
        if (heroi1.rows[0].nivel > heroi2.rows[0].nivel) {
        return heroi1Id;
    } else if (heroi1.rows[0].nivel < heroi2.rows[0].nivel) {
        return heroi2Id;
    }else {
       
        if (heroi1.rows[0].hp > heroi2.rows[0].hp) {
            return heroi1Id;
        } else if (heroi1.rows[0].hp < heroi2.rows[0].hp) {
            return heroi2Id;

        } else {
            return heroi1Id;
        }
        
}
}
}





app.get('/batalhas', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM batalhas');
        res.json(rows);
    } catch (error) {
        console.error("Erro ao mostrar batalha", error);
        res.status(500).send("Erro ao mostrar batalha");
    }
});



app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} 🤯😤🤠🤬`);
});