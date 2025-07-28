
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

//config
app.use(express.urlencoded({extended:true}))
app.use(express.json())

    //sessão
    app.use(session({
        secret:'cursodenode',
        resave:true,
        saveUninitialized:true
    }))
    app.use(flash())

    //midlleware
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
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
app.use('/admin', admin)

//outros
const PORT = 8081
app.listen(PORT, ()=>{
    console.log('Servidor roando!')
})