require('dotenv').config();
require('./config/mongo-connection');

const express = require('express');
const path = require('path');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const passport = require('passport');
require('./config/passport/localStrategy');

require('./config/cloudinary-config');

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
		store: MongoStore.create({ mongoUrl: process.env.MONGO_DB_URI }),
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

module.exports = app;
