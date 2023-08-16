const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// referencia al modelo donde vamos autenticas

const Usuarios = require('../models/Usuarios')

//local strategy - login con credenciales propias (usuario y password)

passport.use(
    new LocalStrategy(
        //por default passport espera un usuario y password
        {
            usernameField : 'email',
            passwordField: 'password'
        },
        async (email, password, done)=> {
            try {
                const usuario = await Usuarios.findOne({
                    where : {email: email}
                })

                //El usuario existe pero el password es incorrecto

                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message : 'Password incorrecto'
                    })
                }

                //email existe y el password es correcto

                return done(null, usuario)
            } catch (error) {
                // Ese usuario no existe

                return done(null, false, {
                    message : 'Esa cuenta no existe'
                })
            }
        }
    )
)


//serializar el usuario

passport.serializeUser((usuario, callback)=>{
    callback(null, usuario)
})

//deserializar el usuario

passport.deserializeUser((usuario,callback)=>{
    callback(null,usuario)
})


//exportar

module.exports = passport