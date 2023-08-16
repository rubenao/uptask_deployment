//express router

const express = require('express');

const router = express.Router();

//Importar express validator

const { body } = require('express-validator')

//Importamos el controlador
const proyectosController = require ('../controllers/proyectosController')

const tareasController = require('../controllers/tareasController')

const usuariosController = require('../controllers/usuariosController')

const authController = require('../controllers/authController')

module.exports = function (){

    router.get('/', 

        authController.usuarioAutenticado,
        proyectosController.proyectosHome)
    router.get('/nuevo-proyecto', 
    
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto)

    router.post('/nuevo-proyecto', 



        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto);

    //Listar proyectos

    router.get('/proyectos/:url', 
    authController.usuarioAutenticado,
    proyectosController.proyectoPorUrl)

    //Actualizar el proyecto

    router.get('/proyecto/editar/:id', 
    authController.usuarioAutenticado,
    proyectosController.formularioEditar)

    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto);


    //eliminar proyectos

    router.delete('/proyectos/:url', 
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto);

    //tareas

    router.post('/proyectos/:url', 
    authController.usuarioAutenticado,
    tareasController.agregarTarea)

    router.patch('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea )

    //eliminar tarea

    router.delete('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.eliminarTarea )

    //crear nueva cuenta

    router.get('/crear-cuenta', usuariosController.formCrearCuenta)

    router.post('/crear-cuenta', usuariosController.crearCuenta)

    router.get('/iniciar-sesion', usuariosController.formIniciarSesion)

    router.post('/iniciar-sesion', authController.autenticarUsuario)

    router.get('/cerrar-sesion', authController.cerrarSesion)

    router.get('/reestablecer', usuariosController.formReestablecerPassword)

    router.post('/reestablecer', authController.enviarToken)

    router.get('/reestablecer/:token', authController.validarToken)

    router.post('/reestablecer/:token', authController.actualizarPassword)

    return router;
    
}