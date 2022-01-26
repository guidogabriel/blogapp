//Carregando módulos
    const express = require('express')
    const { engine } = require('express-handlebars');
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')

    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')
    
    const usuarios = require('./routes/usuario');
    
    const passport = require('passport');
    require('./config/auth')(passport)

    const db = require('./config/db')

//Configuraçoes
    //Sessão
        app.use(session({
            secret: "cursodenodequalquercoisa",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //midleware
        app.use((req, res, next) => {
            //res.locals.nome = "Meu nome" //criação de variaveis globais
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null; //req.user é criado pelo pasaport e armazena dados do usuário logado
            next()
        })
    //Body Parser
        app.use(bodyParser.urlencoded({extended : true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', engine({ 
            defaultLayout: 'main',
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
            },
        }));
        app.set('view engine', 'handlebars');
    //Mongoose
        mongoose.Promise = global.Promise;
        //mongoose.connect("mongodb://localhost/blogapp").then(() => {
        //mongoose.connect("mongodb+srv://guidogabriel:jg9J-XKbUkDKBWp@cluster0.fu1c4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority").then(() => {
        mongoose.connect(db.mongoURI).then(() => {
            console.log('conectado ao mongo')

        }).catch((err) => {
            console.log('erro ao se conectar no mong: '+ err)
        })

    //Public
        app.use(express.static(path.join(__dirname, 'public'))) //Dizemos ao express que a pasta que guarda todos os nossos arquivos estáticos é na pasta public

      
//Rotas
    app.get('/', (req, res) => {
        Postagem.find().populate('categoria').sort({data: "desc"}).then((postagens) =>{
            res.render('index', {postagens : postagens})    
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listas as portagens")
            res.redirect('/404')
        })
    })

    app.get('/postagem/:slug', (req, res) =>{
        Postagem.findOne({slug: req.params.slug}).then((postagem) => {
            if(postagem) {
                res.render('postagem/index', {postagem : postagem})
            }else {
                req.flash("error_msg","Essa postagem nao existe")
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect('/')
        })
    })

    app.get('/categorias', (req, res) => {
        Categoria.find().then((categorias) => {
            res.render('categorias/index', ({categorias: categorias}))
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao listar as categorias")
            res.redirect('/')
        })
    })

    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({slug: req.params.slug}).then((categoria) => {
            if(categoria) {
                Postagem.findOne({categoria: categoria._id}).then((postagens) => {
                    res.render('categorias/postagens', {postagens : postagens, categoria: categoria})
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao listar os posts")
                    res.redirect('/')
                })
            }else {
                req.flash("error_msg", "Esta categoria não existe")
                res.redirect('/')
            }

        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao carregar a página desta categoria")
            res.redirect('/')
        })
    })

    app.get('/404', (req, res) => {
        res.send('Erro 404!')
    })

    app.use('/admin', admin) //Note que existe um prefixo admin. Ou seja, vai ficar localhost:8081/admin/posts
    app.use('/usuarios', usuarios)
//Outros
const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
    console.log('Servidor Rodando!')
})

