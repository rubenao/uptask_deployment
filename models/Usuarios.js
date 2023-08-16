const Sequealize = require('sequelize')

const db =require('../config/db')

const Proyectos = require('../models/Proyectos')

const bcrypt = require('bcrypt-nodejs')

const Usuarios = db.define('usuarios', {

    id: {

        type: Sequealize.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },
    email : {

        type: Sequealize.STRING(60),
        allowNull: false,
        validate: {
            isEmail : {
                msg : 'Agrega un correo válido'
            },
            notEmpty : {
                msg: 'el email no puede ir vacio'
            }
        },
        unique: { 
            args: true,
            msg: 'Usuario ya registrado'
        }


    },
    password : {
        type: Sequealize.STRING(60),
        allowNull : false,
        validate: {
            notEmpty : {
                msg: 'el password no puede ir vacio'
            }
        }
        
    },
    token:{
        type: Sequealize.STRING
    },
    expiracion:{
        type: Sequealize.DATE
    }
}, {
    hooks :{
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
        },
    }
})

//Metodos personalizados

Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

Usuarios.hasMany(Proyectos)

module.exports = Usuarios;