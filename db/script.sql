CREATE DATABASE batalha_herois

CREATE TABLE herois {
id PRIMARY KEY,
nome VARCHAR(50),
poder VARCHAR(50),
nivel INTEGER,
hp INTEGER
};


CREATE TABLE batalhas{
id SERIAL PRIMARY KEY,
heroi1_id ,
FOREIGN KEY (heroi1_id) REFERENCES herois(id),
heroi2_id,
FOREING KEY (heroi2_id) REFERENCES herois(id),
vencedor_id,
FOREING KEY (winner_id) REFERENCES herois(id),
perdedor_id,
FOREING KEY (perdedor_id) REFERENCES herois(id),
}
