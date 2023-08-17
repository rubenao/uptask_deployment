const  Sequelize  = require('sequelize');

//extraer valores de variables .env
require('dotenv').config({path:'.env'})


// Option 3: Passing parameters separately (other dialects)
const db = new Sequelize(process.env.BD_NOMBRE,
  process.env.BD_USER,
  process.env.BD_PASSWORD, {

  host: process.env.BD_HOST,
  dialect: 'postgres'/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
  port: process.env.BD_PORT,
  //operatorsAliases: false,
  define: {
    timestamps: false
  }
});

module.exports = db