/*
    SCRIPT PARA ADICIONAR ADMINISTRADORES APENAS
*/
//const express = require("express")
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")

// Configuração Mongoose
    mongoose.Promise = global.Promise;
    mongoose.set("strictQuery", true);
    mongoose.connect('mongodb://127.0.0.1:27017/blogapp', 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).
    then(() => {
        console.log('MongoDB "("ADMIN")" conectado...')
    }).
    catch((err) => {
        console.log('"("ADMIN")"Erro ao se conectar: ' + err)
    })

// Inserindo usuário ADMIN
const userAdmin = new Usuario({
    nome: "Ruffino",
    email: "ruffino@email.com",
    eAdmin: 1,
    senha: "senha1"
}).save().then(() => {
    console.log("Usuário ADMIN cadastrado com sucesso!")
}).catch((err) => {
    console.log("Erro ao cadastrar usuário ADMIN! Erro: " + err)
})

/*
bcrypt.genSalt(10, ( erro, salt ) => {
    bcrypt.hash(userAdmin.senha, salt, (erro, hash) => {
        if( erro ) {
            console.log("Houve um erro durante o salvamento do usuário ADMIN!")
        }

        userAdmin.senha = hash
        userAdmin.save().then(() => {
            console.log("Usuário ADMIN criado com sucesso!")
        }).catch(( err ) => {
            console.log("Houve um erro ao criar o usuário ADMIN, tente novamente!" + err)
        })
    })
})
*/