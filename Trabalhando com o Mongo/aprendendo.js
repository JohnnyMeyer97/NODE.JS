const mongoose = require('mongoose');

// Configurando o mongoose
    mongoose.Promise = global.Promise;
    mongoose.set("strictQuery", true);
    mongoose.connect('mongodb://127.0.0.1:27017/aprendendo', 
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

// Model - Usuários
// Definindo o model
const UsuarioSchema = mongoose.Schema({

    nome: {
        type: String,
        require: true       // Se será obrigatório o preenchimento
    },
    sobrenome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    idade: {
        type: Number,
        require: true
    },
    pais: {
        type: String
    }
})

// Collection
    mongoose.model('usuarios', UsuarioSchema)   // "Collection que irá armazenar usuários", model referência a collection

// Inserindo novo usuário
    const user = mongoose.model('usuarios')
    new user({
        nome: "Johnny",
        sobrenome: "Ruffino",
        email: "email@email.com",
        idade: 25,
        pais: "USA"
    }).save().then(() => {
        console.log("Usuário cadastrado com sucesso!")
    }).catch((err) => {
        console.log("Erro ao cadastrar usuário! Erro: "+err)
    })
