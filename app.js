const express = require ('express');
const mongoose = require ('mongoose');
const passport = require ('passport');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const cookieParser = require ('cookie-parser');
const cors = require ('cors');
const logging = require ('morgan');
const { auth } = require('./middleware/auth');
require('dotenv').config();

const app = express();
const database = process.env.DATABASE_URL
const secretKey = process.env.JWT_SECRET_KEY

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
app.use(passport.initialize());


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey,
}, (jwtPayload, done) => {
    UserActivation.findById(jwtPayload.sub, (error, user) => {
        if (error) {
            return done(error, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));



//Routes
app.use('/calendar' , require('./routes/memo'))
app.use('/register' , require('./routes/register'))
app.use('/login' , require('./routes/login'))
app.use('/activity', auth, require('./routes/activity'));
app.use('/post', require('./routes/post'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/user', require('./routes/user'))


const ipAddress = '127.0.0.1';
const port = 8000;
app.listen(port , ipAddress , () => {
    console.log(`Server starting on IP:${ipAddress} Port: ${port}`)
})

module.exports = app;