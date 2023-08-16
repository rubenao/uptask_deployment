const Usuarios = require('../models/Usuarios')

exports.formCrearCuenta = (req,res)=> {

    res.render('crearCuenta', {

        nombrePagina : 'Crear cuenta en Uptask'
    })
}

exports.crearCuenta=  async (req, res)=>{

    //leer los datos

    const { email, password} = req.body


    //Cuando se tenga un error utilizar try catch para manejar los errores

    try {

        //crear el usuario
        await  Usuarios.create ({
            email, password
        })

        res.redirect('/iniciar-sesion')
    } catch (error){
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta' ,{

            messages: req.flash(),
            nombrePagina: 'Crear cuenta en Uptask',
            email: email,
            password: password
        })
    }

    
}

exports.formIniciarSesion = (req,res)=> {
    const {error} = res.locals.messages
    res.render('iniciarSesion', {

        nombrePagina : 'Iniciar sesion en Uptask',
        error: error
    })
}


exports.formReestablecerPassword = (req,res)=>{

    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña'
    })
}