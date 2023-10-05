const express = require ('express');
const mongoose = require ('mongoose');
const passport = require ('passport');
const cookieParser = require ('cookie-parser');
const cors = require ('cors');
const logging = require ('morgan');
require('dotenv').config()

const app = express()
const database = process.env.DATABASE_URL

mongoose.Promise = global.Promise;

mongoose.connect(database , {
    useNewUrlParser: true,
    useUnifiedTopology : true,
});

mongoose.connection.on('connected' , () => {
    console.log("Connected to mongoDB")
});

const allowedMethods = ['GET' , 'PUT' , 'POST', 'DELETE'];
const allowedHeaders = ['Authorization' , 'Content-Type'];

app.use(cors({
    origin : '*',
    methods: allowedMethods.join(', '),
    allowedHeaders : allowedHeaders.join(', '),
    credentials: true,
}));

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(cookieParser());
app.use(logging('tiny'));

//Routes
app.use('/calendar' , require('./routes/memo'))

const ipAddress = '127.0.0.1';
const port = 8000;

app.listen(port , ipAddress , () => {
    console.log(`Server starting on IP:${ipAddress} Port: ${port}`)
})

module.exports = app;