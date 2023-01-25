const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require('body-parser');
const Post = require('./models/Post');

// Configurações
    // Template Engine
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Body Parser
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())

// Rotas
    app.get('/', function(req, res){
        //Post.findAll({order: [['id', 'DESC']]}).then(function(posts){  // novo - antigo, mudar ordem de visualização da tabela
        //Post.findAll({order: [['id', 'ASC']]}).then(function(posts){   // antigo -novo, mudar ordem de visualização da tabela
        Post.findAll().then(function(posts){                            // posts = pode ser qualquer nome, recebe valor de Post.all()
            res.render('home', {posts: posts})                          // posts: posts = posts:(pode ser qualquer nome), posts - nome da variável passada acima
        })
    })

    app.get('/cad', function(req, res){
        res.render('formulario');
    })

    app.post('/add', function(req, res){
        Post.create({
            titulo: req.body.titulo,
            conteudo: req.body.conteudo
        }).then(function(){
            //res.send("Post enviado com sucesso!")
            res.redirect('/')
        }).catch(function(erro){
            res.send("Falha ao enviar post! "+erro)
        })
    })

    app.get('/deletar/:id', function(req, res){
        Post.destroy({where: {'id': req.params.id}}).then(function(){
            //res.send("Postagem deletada com sucesso!")
            res.redirect('/')
        }).catch(function(erro){
            res.send("Esta postagem não existe!")
        })
    })
/*
sequelize.authenticate().then(function() {
    console.log("Conectado com sucesso ao Banco de dados!");
}).catch(function(erro) {
    console.log("Falha ao se conectar ao banco de dados: "+ erro);
});
*/
app.listen(8081, function(){
    console.log("Servidor rodando na url http://localhost:8081");
});