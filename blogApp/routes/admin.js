const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")   // Quer dizer que dentro do objeto eAdmin eu quero pegar apenas a função eAdmin. Irá criar uma variável com o mesmo nome eAdmin

router.get('/', eAdmin, (req, res) => {
    res.render("admin/index")
})

router.get('/post', eAdmin, (req, res) => {
    res.render("admin/post")
})

router.get("/categorias", eAdmin, (req, res) => {
    Categoria.find({}).sort({date: 'desc'}).lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
})

router.get("/categorias/add", eAdmin, (req, res) => {
    res.render("admin/addcategorias")
})

router.post("/categorias/nova", eAdmin, (req, res) => {
    // Validação
    //validation()

    var erros = []

    if( !req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome inválido!"})
    }
    if( !req.body.slug || typeof req.body.slug == undefined || req.body.slug == null ) {
        erros.push({texto: "Slug inválido!"})
    }
    if( req.body.nome.length < 2 ) {
        erros.push({texto: "Nome muito pequeno!"})
    }
    if( req.body.slug.length < 2 ) {
        erros.push({texto: "Slug muito pequeno!"})
    }

    if( erros.length > 0 ) {
        res.render("admin/addcategorias", {erros: erros})
    } else {
        // Inserir dados no banco de dados
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("erros_msg", "Houve um erro ao salvar a categoria no banco de dados, tente novamente!")
            res.redirect("/admin")
        })
    }
})

// Edição no front-end, só visual
router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
/*  EXPLICAÇÃO
    "Categoria.findOne({_id: req.body.id})': Pesquiso por UM id, id que foi passado por parâmetro para a rota "...s/edit/:id""
    ".then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
        })": Então eu pego a variável 'categoria'(qualquer nome) e passo para a página editcategorias
*/
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
})

// Edição no banco de dados
router.post("/categoria/edit", eAdmin, (req, res) => {
    Categoria.findOne({_id: req.body.id}).then((category) => {
        category.nome = req.body.nome
        category.slug = req.body.slug

        category.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao editar a categoria")
            res.redirect("/admin/categorias")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.post("/categoria/deletar", eAdmin, (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria!")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", eAdmin, (req, res) => {
    Postagem.find().lean().populate({path: 'categoria', strictPopulate: false}).sort({data: "desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/postagens")
    })
})

router.get("/postagens/add", eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {         // .find retorna tudo o que tem em Categoria
        res.render("admin/addpostagens", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})

router.post("/postagens/nova", eAdmin, (req, res) => {

    var erros = []

    if( req.body.categoria == "0" ) {
        erros.push({texto: "Categoria inválida, registre uma categoria!"})
    }

    if( erros.length > 0 ) {
        res.render("admin/addpostagens", {erros: erros})
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro durante o salvamento da postagem!")
            res.redirect("/admin/postagens")
        })
    }

})

router.get("/postagens/edit/:id", eAdmin, (req, res) => {
    Postagem.findOne({_id: req.params.id}).lean().then((postagens) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", {categorias: categorias, postagens: postagens})       // Quando achar as postagens e as categorias ira renderizar a página editpostagens
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias!")
            res.redirect("/admin/postagens")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição!")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagens/edit", eAdmin, (req, res) => {
    //(validação)
    Postagem.findOne({_id: req.body.id}).then((postagem) => {
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso!!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Erro interno!")
            res.redirect("/admin/postagens")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar a edição!")
        res.redirect("/admin/postagens")
    })
})

router.get("/postagens/deletar/:id", eAdmin, (req, res) => {
    Postagem.remove({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso!!")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/admin/postagens")
    })
})

module.exports = router;

/*
    COLOCAR A VALIDAÇÃO EM UMA FUNÇÃO PARA PODER CHAMAR QUANDO ADICIONAR E TAMBEM QUANDO EDITAR!!

    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {...
        E
    Categoria.findOne({_id: req.body.id}).then((category) => {...

        PELO JEITO DÃO NO MESMO, SÓ UM ABORDAGEM DIFERENTE, O QUE INTERESSA É ACHAR O ID!
*/