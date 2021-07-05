const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'root', '@1n2t3o4', {
    host: 'localhost',
    dialect: 'mysql'
});

// TESTE PARA VER SE ESTÁ SE CONECTANDO AO BANCO DE DADOS

sequelize.authenticate().then(function() { // Se der certo
    console.log("Conectado com sucesso!");
}).catch(function(erro) { // Se der errado
    console.log("Falha ao se conectar: "+erro);
});