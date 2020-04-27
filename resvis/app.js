'use strict';
const bodyParser = require("body-parser")
const express = require('express');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('resvis', 'postgres', '', {
  host: 'postgres',
  dialect: "postgres"/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

const users = require("./routes/users/users")
const restaurants = require("./routes/restaurants/restaurants")

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// Middlewares
app.use(bodyParser.json())

// Routes
app.use("/users", users)
app.use("/restaurants", restaurants)


app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
