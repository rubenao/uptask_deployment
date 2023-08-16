const express = require('express')
const routes = require ('./routes')
const path = require('path');
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')

//extraer valores de variables .env
require('dotenv').config({path:'.env'})

// helpers con algunas funciones

const helpers = require('./helper')

//Crear la conexión a la BBDD

const db = require('./config/db')

//Importar el modelo

require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')

db.sync()
    .then(()=>{
        console.log('conectado al servidor')
    })
    .catch(error => console.log(error));

//Crear una app de express

const app= express();

// Donde cargar los archivos estaticos

app.use(express.static('public'));

//Habilitar pug

app.set('view engine', 'pug')

//Habilitar body parser para leer datos del formulario

app.use(bodyParser.urlencoded({extended: true}))



//Añadir la carpeta de las vistas
// ruta para el home
//request -> consulta al servidor
//res -> respuesta del servidor

app.set('views', path.join(__dirname, './views'));


//agregar flash messages

app.use(flash())

app.use(cookieParser())

// sesiones nos permiten navegar entre distintas páginas sin volvernos a autenticar

app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())

app.use(passport.session())

//Pasar vardump a la aplicacion

app.use((req,res, next ) => {
    res.locals.vardump = helpers.vardump;
    res.locals.messages = req.flash()
    res.locals.usuario = {...req.user} || null
    next();
})



app.use('/', routes())

//Asignar un servidor y puerto

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.listen(port, host, ()=>{
    console.log('el servidor esta funcionando')
});

