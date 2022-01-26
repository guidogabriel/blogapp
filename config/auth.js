const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//Model de usua´rio
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

module.exports = function(passport) {

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha' }, (email, senha, done) => {

        Usuario.findOne({email: email}).then((usuario) => {
            if(!usuario){
                return done(null, false, {message: 'Esta conta nao existe'})
            }
            //Se a conta existir...
            bcrypt.compare(senha, usuario.senha, (erro, batem) => {

                if(batem){
                    return done(null, usuario)
                } else {
                    return done(null, false, {message: 'Senha incorreta'})
                }
            })

        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect('/')
        })
    }))

    //salva dados do usuário numa sessão
    passport.serializeUser((usuario, done) => {

        done(null, usuario.id)
    })

    //Procura um usuario pelo id dele
    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario)
        })
        
    })

}