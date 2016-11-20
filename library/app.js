var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');

var app = express();
var sql = require('mysql');
var connection = sql.createConnection({
    user: 'root',
    password: 'deepika1234',
    host: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'node',

    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
});

connection.connect(function(err){
if(!err) {
   console.log('Database is connected ... nn');    
} else {
   console.log('Error connecting database ... nn'+err);    
}
});


 /*sql.connect(connection, function(err){
     console.log(err);
});*/
var port = process.env.PORT || 6000;
var nav = [{
    Link: '/Books',
    Text: 'Book'
    }, {
    Link: '/Authors',
    Text: 'Author'
    }];
var bookRouter = require('./src/routes/bookRoutes')(nav);
var adminRouter = require('./src/routes/adminRoutes')(nav);
var authRouter = require('./src/routes/authRoutes')(nav);


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: 'library'}));

require('./src/config/passport')(app);


app.set('views', './src/views');
app.set('view engine', 'ejs');


app.use('/Books', bookRouter);
app.use('/Admin', adminRouter);
app.use('/Auth', authRouter);


app.get('/', function (req, res) {
    res.render('index', {
        title: 'Hello from render',
        nav: [{
            Link: '/Books',
            Text: 'Books'
        }, {
            Link: '/Authors',
            Text: 'Authors'
        }]
    });
});

app.get('/books', function (req, res) {
    res.send('Hello Books');
});

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});