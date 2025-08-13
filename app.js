
//carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const moment = require('moment')
require('./models/Postagem')
const Postagem =  mongoose.model('postagens')
require('./models/Categoria')
const Categoria = mongoose.model('categorias')
const usuario = require('./routes/usuario')
const passport = require("passport")
require('./config/auth')(passport)


//config
app.use(express.urlencoded({extended:true}))
app.use(express.json())

    //sessão
    app.use(session({
        secret:'cursodenode',
        resave:true,
        saveUninitialized:true
    }))

    app.use(passport.initialize())
    app.use(passport.session())


    app.use(flash())

    //midlleware
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        res.locals.error = req.flash('error')

        //passport armazena dados do usuário logado, se não estiver usuário o valor e null
        res.locals.user = req.user || null;
        
        next()
    })

    //handlebars
    app.engine('handlebars', handlebars.engine({
        defaultLayout: 'main',
        runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers:{
        formatDate: (date)=>{
            return moment(date).format('DD/MM/YYYY HH:mm')
        }
    }
    }))
    app.set('view engine', 'handlebars')

    //Mongoose
    mongoose.connect('mongodb://localhost/blogapp').then(()=>{
        console.log('banco conectado!')
    }).catch((err)=>{
        console.error('Erro ao conectar!'+ err)
    })
    
    //Public
    app.use(express.static(path.join(__dirname,"public")))

//rotas
app.get('/', (req,res)=>{
    Postagem.find().populate('categoria').sort({data:'desc'}).then((postagens)=>{
        res.render('index',{postagens: postagens})

    }).catch((err)=>{
        req.flash('error_msg','Houve um erro', err)
        res.redirect('/404')
    })
})

app.get('/postagem/:slug', (req,res)=>{
    Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
        if(postagem){
            res.render('postagem/index', {postagem: postagem})
        
        } else{
            req.flash('error_msg','Essa postagem não existe')
            res.redirect('/')
        }
    }).catch((err)=>{
        req.flash('error_msg', 'houve um erro interno', err)
        res.redirect('/')
    })
})

app.get('/categorias', (req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render('categoria/index',{categorias: categorias})
    }).catch((err) =>{
        req.flash('error_msg', 'Erro ao listar categorias')
        res.redirect('/')
    })
})


// Rota para exibir postagens de uma categoria específica pelo slug
app.get('/categorias/:slug', (req, res) => {
    // Busca a categoria pelo slug passado na URL
    Categoria.findOne({slug: req.params.slug }).then((categoria) => {
        if (categoria) {
            // Se encontrar a categoria, busca todas as postagens relacionadas a ela
            Postagem.find({ categoria: categoria._id }).then((postagens) => {
                // Renderiza a página mostrando as postagens da categoria
                res.render('categoria/postagens', { postagens: postagens, categoria: categoria })
            }).catch((err) => {
                // Se ocorrer erro ao buscar postagens, exibe mensagem e redireciona
                req.flash('error_msg', 'Erro ao listar postagem!')
                res.redirect('/')
            })
        } else {
            // Se não encontrar a categoria, exibe mensagem e redireciona
            req.flash('error_msg', 'Essa categoria não existe!')
            res.redirect('/')
        }
    })
})

app.get('/404',(req,res)=>{
    res.send('Erro 404!')
})



app.use('/admin', admin)
app.use('/usuarios', usuario)

//outros
const PORT = 8081
app.listen(PORT, ()=>{
    console.log('Servidor roando!')
})