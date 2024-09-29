require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const dbConn = require("./app/config/dbConn.config");
const rateLimiter = require("./app/middleware/rateLimiter");

const routes = require("./app/routes");

mongoose.connect(dbConn.url,{
    dbName: process.env.DB_NAME
}).then(() => {
    console.log("Connected to the database");
}).catch(err => {
    console.error("Cannot connect to the database", err);
    // process.exit();
});

const app = express();

const PORT = process.env.NODE_DOCKER_PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// method override
app.use(methodOverride('_method'));

// rate limiter
app.use(rateLimiter);

app.use('/api', [routes.authRoutes, routes.otpRoutes]);
app.use('/api/todos', routes.todoRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the application." });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;


