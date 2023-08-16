const passport = require('passport')
const Usuarios = require('../models/Usuarios')
const crypto = require('crypto')
const { Sequelize } = require('sequelize')
const bcrypt = require('bcrypt-nodejs')
const Op = Sequelize.Op
const enviarEmail = require('../handlers/email')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})


//funcion para revisar si el usuario esta logueado o no

exports.usuarioAutenticado = (req,res,next)=>{
    //si el usuario esta autenticado, adelante

    if(req.isAuthenticated()){
        return next()
    }


    //sino esta autenticado, redirigir al formulario

    return res.redirect('/iniciar-sesion')
}

exports.cerrarSesion = (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion') //al cerrar sesion nos lleva al login
    })
}

//genera un token si el usuario es valido

exports.enviarToken = async (req,res) =>{

    //verificar que el usuario existe
    const usuario = await Usuarios.findOne({
        where: {
            email: req.body.email
        }
    })

    //si no existe el usuario

    if(!usuario){
        req.flash('error', 'No existe esa cuenta')
        res.render('reestablecer', {
            nombrePagina: 'Reestablecer tu contraseña',
            messages: req.flash()
        })
    } else {
        //usuario existe

        usuario.token = crypto.randomBytes(20).toString('hex')

        //expiracion

        usuario.expiracion = Date.now()+ 3600000

        //guardarlos en la BBDD

        await usuario.save()

        // url de reset

        const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`

        //Envia el correo con el token

        await enviarEmail.enviar({
            usuario : usuario,
            subject: 'Password Reset',
            resetUrl : resetUrl,
            archivo: 'reestablecer-password'
        })

        //terminar la ejecución

        req.flash('correcto', 'Se envio un mensaje a tu correo' )

        res.redirect('/iniciar-sesion')


    }

    


    
}

exports.validarToken = async (req,res)=>{
    const usuario = await Usuarios.findOne({where:{
        token: req.params.token
    }})

    if(!usuario){
        req.flash('error', 'No valido')
        res.redirect('/reestablecer')
    } else {

        //formulario para generar el password

        res.render('resetPassword', {
            nombrePagina: 'Reestablecer contraseña'
        })


    }

    
}

exports.actualizarPassword = async (req, res) => {


    //Verifica el token valido y la fecha de expiracion
    const usuario = await Usuarios.findOne({where:{
        token: req.params.token,

        expiracion: {
            [Op.gte] : Date.now()
        }
    }})

    //verificamos si el usuario existe

    if(!usuario){
        req.flash('error', 'No valido')
        res.redirect('/reestablecer')
    } else {

        //hashear el nuevo password

        usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))

        usuario.token = null
        usuario.expiracion = null

        //guardamos el nuevo password

        await usuario.save()

        req.flash('correcto', 'Tu password se ha modificado correctamente')

        res.redirect('/iniciar-sesion')
    }
}