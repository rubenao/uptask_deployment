const Sequealize = require('sequelize')
const db = require('../config/db')
const Proyectos = require('../models/Proyectos')

const Tareas = db.define('tareas', {
    id : {
        type: Sequealize.INTEGER,
        primaryKey : true,
        autoIncrement: true,
    },
    tarea:{
        type: Sequealize.STRING,
    } ,
    estado:{
        type:Sequealize.INTEGER
    }
})

//Agregando relación
Tareas.belongsTo(Proyectos) //una tarea pertener a un proyecto o podría ser Proyectos.hasMany(Tareas)


module.exports = Tareas;