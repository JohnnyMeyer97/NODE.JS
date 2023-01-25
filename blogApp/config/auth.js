const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Model de usuário
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

module.exports = function( passport ){
    passport.use(new localStrategy({usernameField: "email", passwordField: "senha"}, (email, senha, done) => {      // usernameField: "email": Qual campo voçe quer usar para a autenticação
        Usuario.findOne({email: email}).then((usuario) => {
            if( !usuario ){
                return done(null, false, {message: "Esta conta não existe!"})
            /* 
            done é um parâmetro de callback
            done(dados da contaa autenticada, autenticado com sucesso ou não, mensagem)
            */
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                if( batem ){
                    return done(null, usuario)
                } else {
                    return done(null, false, {message: "Senha incorreta!"})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done) => {     // Salvar os dados do usuário em uma sessão
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    })
}