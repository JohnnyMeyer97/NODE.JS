const Sequelize = require('sequelize');
/*
const sequelize = new Sequelize('nome_Do_Banco_De_Dados', 'Nome_Do_Usuario_root', 'senha_Do_Mysql', {
    host: 'Servidor_Que_Esta_O_Banco_De_Dados',
    dialect: 'Tipo_Do_Banco_De_Dados'
});
*/
const sequelize = new Sequelize('teste_aula', 'root', 'breno2015', {
    host: 'localhost',
    dialect: 'mysql'
});

// TESTE PARA VER SE ESTÁ SE CONECTANDO AO BANCO DE DADOS

sequelize.authenticate().then(function() { // Se der certo
    console.log("Conectado com sucesso!");
}).catch(function(erro) { // Se der errado
    console.log("Falha ao se conectar: "+ erro);
});