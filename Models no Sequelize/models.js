const Sequelize = require('sequelize');
const sequelize = new Sequelize('teste_aula', 'root', 'breno2015', {
    host: 'localhost',
    dialect: 'mysql'
});

const Postagem = sequelize.define('postagens', {    // cria uma tabela
    titulo: {                                       // Campos, colunas
        type: Sequelize.STRING                      // Caracteres limitado
    },
    conteudo: {
        type: Sequelize.TEXT                        // Caracteres ilimitado
    }
})
/*
Postagem.create({                                   // Adicionando conteúdo
    titulo: "Um titulo qualquer",
    conteudo: "Qualquer coisa"
})
*/

const Usuario = sequelize.define('usuarios', {
    nome: {
        type: Sequelize.STRING
    },
    sobrenome: {
        type: Sequelize.STRING
    },
    idade: {
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING
    }
})

/*
Usuario.create({ //Inserir dados
    nome: "Johnny",
    sobrenome: "Ruffino",
    idade: 24,
    email: "johnny@ruffino.com"
})
*/

//Postagem.sync({force:true}) // Criando no myslq
//Usuario.sync({force:true})  // Criando no myslq
/*
    Após criar a tabela ou adicionar conteúdo a ela, exclua ou comente para não recriar a tabela
*/