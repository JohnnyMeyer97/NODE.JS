const express = require("express");                 // Principal ferramenta usada para criar aplicações backend usando o node.
const app = express();
const handlebars = require("express-handlebars");   // Template engine, dá muitas funcionalidades ao html
const bodyParser = require('body-parser');          // Módulo usado para processar dados enviados do corpo de uma requisição http
const Sequelize = require('sequelize');             // Modulo que ajuda a trabalhar com o banco de dados (mysql) diretamente com o node.js

// Configurações
    // Template Engine
        app.engine('handlebars', handlebars({defaultLayout: 'main'})) // Template padrão da aplicação
        app.set('view engine', 'handlebars')
    // Body Parser
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())
    // Conexão com o banco de dados MySql
        const sequelize = new Sequelize('teste_aula', 'root', 'breno2015', {
            host: 'localhost',
            dialect: 'mysql'
        });
// Rotas
    app.get('/', function(req, res){
        res.send("BEM VINDO A PÁGINA DE CADASTRO DE POSTAGENS, ACESSE: http://localhost:8081/cad para cadastrar.");
    });

    app.get('/cad', function(req, res){
        res.render('formulario');
    });

    app.post('/add', function(req, res){
        res.send("Texto: "+req.body.titulo+" Conteudo: "+req.body.conteudo);
    });

// Teste para ver se está se conectando ao banco de dados

sequelize.authenticate().then(function() { // Se der certo
    console.log("Conectado com sucesso ao Banco de dados!");
}).catch(function(erro) { // Se der errado
    console.log("Falha ao se conectar ao banco de dados: "+ erro);
});

app.listen(8081, function(){
    console.log("Servidor rodando na url http://localhost:8081");
});