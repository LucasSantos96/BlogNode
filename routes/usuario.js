// Importa o módulo express para criar rotas
const express = require('express')
// Cria um roteador do Express
const router = express.Router()

// Importa o mongoose para manipulação do banco de dados
const mongoose = require('mongoose')
// Carrega o model de usuário
require('../models/Usuario')
// Cria uma referência ao model de usuários
const Usuario = mongoose.model('usuarios')
// Importa o bcryptjs para criptografar senhas
const bcrypt = require('bcryptjs') 

const passport = require('passport')
const { eAdmin } = require('../helpers/eadmin')

// Rota GET para exibir o formulário de registro de usuário
router.get('/registro', (req, res) => {
    res.render('usuarios/registro')
})

            //REGISTRO  

// Rota POST para processar o registro de usuário
router.post('/registro', (req, res) => {
    // Array para armazenar possíveis erros de validação
    const erros = []

    // Validação dos campos do formulário
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        // Verifica se o nome é válido
        erros.push({ texto: 'Nome inválido' })
    } else if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        // Verifica se o email é válido
        erros.push({ texto: 'Email inválido' })
    } else if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        // Verifica se a senha é válida
        erros.push({ texto: 'Senha inválida' })
    } else if (req.body.senha.length < 8) {
        // Verifica se a senha tem pelo menos 8 caracteres
        erros.push({ texto: 'Senha muito curta' })
    } else if (req.body.senha != req.body.senha2) {
        // Verifica se as senhas digitadas são iguais
        erros.push({ texto: 'Senhas não correspondem' })
    }

    // Se houver erros, renderiza o formulário novamente mostrando os erros
    if (erros.length > 0) {
        res.render('usuarios/registro', { erros: erros })
    } else {
        // Verifica se já existe um usuário com o mesmo email
        Usuario.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                // Se já existir, exibe mensagem e redireciona para registro
                req.flash('error_msg', 'Já exite uma conta com esse email')
                res.redirect('/usuarios/registro')
            } else {
                // Cria um novo usuário com os dados do formulário
                const newUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    
                })
                // Gera um salt para criptografar a senha
                bcrypt.genSalt(10, (erro, salt) => {
                    // Criptografa a senha do usuário
                    bcrypt.hash(newUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            // Se ocorrer erro ao criptografar, exibe mensagem e redireciona
                            req.flash('error_msg', 'Houve um erro ao salvar usuário')
                            res.redirect('/')
                        }
                        // Salva o hash da senha no usuário
                        newUsuario.senha = hash

                        // Salva o usuário no banco de dados
                        newUsuario.save().then(() => {
                            req.flash('success_msg', 'usuário criado com sucesso')
                            res.redirect('/')
                        }).catch((err) => {
                            req.flash('error_msg', 'Houve um erro ao salvar usuário', err)
                            res.redirect('/')
                        })
                    })
                })
            }
        }).catch((err) => {
            // Se ocorrer erro na busca do usuário, exibe mensagem e redireciona
            req.flash('error_msg', 'houve um erro!', err)
            res.redirect('/')
        })
    }

})


            //LOGIN 

// Rota GET para exibir o formulário de login
router.get('/login', (req, res) => {
    res.render('usuarios/login')
})

router.post("/login", (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:"/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req,res,next)
})


//Logout

router.get('/logout',(req,res)=>{
 req.logOut((err)=>{
    if(err){
        req.flash('error_msg', 'Houve um erro ao sair')
        return res.redirect('/')
    }
    req.flash('success_msg',"Você saiu da conta")
    res.redirect('/')
 })
 
 
 

})






// Exporta o roteador para ser usado em outros arquivos
module.exports = router