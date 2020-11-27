const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');
const bodyParser = require('body-parser');//I don't even remember why i declared these
const { request } = require('http');//I don't even remember why i declared these

//Initialized project with node init, wrote some scripts for running
//Installed nodemon and bower, installed bootstrap (wrote .bowerrc to load bootstrap into the public\bower_components subfolder)
//Initialize database with 'mongod --...', set it up so we can start it up as a service with 'net start mongodb'
//Run the mongo shell with 'mongo'


//Connect with local MongoDB database via mongoose
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;

//Check connection
db.once('open', () => console.log('Connected to MongoDB'));

//Check for db errors
db.on('error', (err) => console.log(err));

//Init app
const app = express();

//Create body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Set public folder static
app.use(express.static(path.join(__dirname, 'public')));

//Bring the models
let Article = require('./models/article');

//Set view engine to Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Middleware

//Session Middleware
// app.set('trust proxy', 1);
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//Messages Middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
})

//Password Config
require('./config/passport')(passport);
//Password Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//Routes

//Home/Index
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {
            title: 'Articles',
            articles
            });
        }
    });   
});

//Other route files

//Articles Routes
app.use('/articles', require('./routes/articles'));

//Users Routes
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));