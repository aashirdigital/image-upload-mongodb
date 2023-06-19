const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const moragan = require('morgan');
const ConnectDB = require('./config/db');
const bodyParser = require('body-parser');
const path = require('path');

// DOT ENV
dotenv.config();

//MONGODB CONNECT
ConnectDB();

//REST OBJECT
const app = express();

// Increase payload size limit to 50MB
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//MIDDLEWARES
app.use(express.json());
app.use(moragan('dev'))

// ROUTES
app.use('/api/user', require('./routes/UserRoutes'));
app.use('/api/image', require('./routes/ImageRoutes'));

// STATIC FILES
if (process.env.NODE_MODE === "production") {
    app.use(express.static(path.join(__dirname, './client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './client/build/index.html'));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API running..")
    })
}

//PORT
const port = process.env.PORT || 8000

// LISTEN PORT
app.listen(port, (req, res) => {
    console.log(`Server running in ${process.env.NODE_MODE} on PORT: ${port}`.bgGreen.white)
})