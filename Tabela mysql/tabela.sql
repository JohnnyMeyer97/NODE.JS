/* Usa apenas para criar a tabela, digitar, e depois cola no cmd */

CREATE TABLE usuarios(
    nome VARCHAR(50),
    email VARCHAR(100),
    idade INT
);

/* Usa apenas para criar a tabela, digitar, e depois cola no cmd */

INSERT INTO usuarios(nome, email, idade) VALUES(
    "Johnny Ruffino",
    "email@ruffino.com",
    24
);

INSERT INTO usuarios(nome, email, idade) VALUES(
    "Pedro",
    "email@pedro.com",
    32
);

INSERT INTO usuarios(idade, email, nome) VALUES(
    28,
    "email@joao.com",
    "João"
);