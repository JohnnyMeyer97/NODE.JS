// Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")                        // Serve para trabalhar com diretórios e manipular pastas, modulo já vem padrão com node
    const mongoose = require('mongoose')
    const session = require("express-session")
    const flash = require("connect-flash")              // Tipo de sessão que só aparece uma vez, some ao recarregar a página
    const moment = require('moment')                    // Melhorar a visualização da data
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")
    const usuarios = require("./routes/usuario")        // Todas as rotas que estiverem em usuario.js terão p prefixo "/usuarios/"
    const passport = require("passport")
    require("./config/auth")(passport)                  // passport está como parâmetro no module.exports

// Configurações
    // app.use() - É para seu express usar alguma coisa
    // Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,               // resave: Força o salvamento da sessão no registro de sessões, mesmo se a sessão não foi modificada durante a requisição. Pode criar problemas quando são feitas duas requisições em paralelo pelo cliente, pois uma requisição pode sobrescrever-se à outra ao fim da requisição, mesmo que não forem feitas mudanças significativas.
            saveUninitialized: true     // saveUnitialized: Força o salvamento de uma sessão não inicializada no registro de sessões. Uma sessão é dita não inicializada quando ela é nova, porém não é modificada. A documentação ainda diz que "false" é indicado para logins.
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")      // Para criar variáveis globais
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null                     // Irá armazenar os dados do usuário autenticado
            /*
            req.user: variável que o passport cria que armazena os dados do usuário logado
                      Caso não exista usuário logado o valor passado será null
            */
            next()
        })
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({
            defaultLayout: 'main',
            helpers: {
                formatDate: (date) => {
                     return moment(date).format('DD/MM/YYYY')
                }
            }
        }))
        app.set('view engine', 'handlebars')
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.set("strictQuery", true);
        mongoose.connect('mongodb://127.0.0.1:27017/blogapp', 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        }).
        then(() => {
            console.log('MongoDB conectado...')
        }).
        catch((err) => {
            console.log('Erro ao se conectar: ' + err)
        })
    // Public
        app.use(express.static(path.join(__dirname, "public")))     // Diz ao node qual pasta está guardando os arquivos estáticos
// Rotas
    app.use("/admin", admin)                                        // ex: http://localhost:8081/admin/post
    app.use("/usuarios", usuarios)

    app.get("/", (req, res) => {
        Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
            res.render("index", {postagens: postagens})
        }).catch((err) => {
            req.flash("error_msg", "Falha ao carregar ultimas postagens!")
            res.redirect("/404")
        })
    })

    app.get("/postagens/:slug", (req, res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((posts) => {
            if( posts ) {
                res.render("postagem/index", {posts: posts})
            } else {
                req.flash("error_msg", "Esta postagem não existe!")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno!")
            res.redirect("/")
        })
    })

    app.get("/categorias", (req, res) => {
        Categoria.find().lean().then((categorias) => {
            res.render("categoria/index", {categorias: categorias})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao listar as categorias!")
            res.redirect("/")
        })
    })

    app.get("/categorias/:slug", (req, res) => {
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if( categoria ) {
                Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                    res.render("categoria/postagens", {postagens: postagens, categoria: categoria})
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao listar os posts!")
                    res.redirect("/")    
                })
            } else {
                req.flash("error_msg", "Esta categoria não existe!")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao carregar a página desta categoria!")
            res.redirect("/")
        })
    })

    app.get("/404", (req, res) => {
        res.send("Erro 404!")
    })
// Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor rodando!")
})