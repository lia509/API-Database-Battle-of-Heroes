CREATE DATABASE batalha_herois

CREATE TABLE herois (
id SERIAL PRIMARY KEY,
nome VARCHAR(50) NOT NULL,
poder VARCHAR(50)  NOT NULL,
nivel INTEGER  NOT NULL,
hp INTEGER  NOT NULL
);


CREATE TABLE batalhas(
  id SERIAL PRIMARY KEY,
    heroi1_id INT NOT NULL,
    heroi2_id INT NOT NULL,
    vencedor_id INT NULL,
    FOREIGN KEY (heroi1_id) REFERENCES herois(id),
    FOREIGN KEY (heroi2_id) REFERENCES herois(id),
    FOREIGN KEY (vencedor_id) REFERENCES herois(id)

);
