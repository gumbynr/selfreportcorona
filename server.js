var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require("mongodb");
var session = require('express-session');
var ObjectID = mongodb.ObjectID;

var app = express();

app.use(express.static(__dirname + '/api'));
app.set('views', __dirname + '/api/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
  extended: true
}));
	
app.use(bodyParser.json());
	
/*
var db;
//Connect to the database before starting the application server.
//mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {		
mongodb://heroku_h2hgx19t:mtem5s55c2ek42eqqfsecd07si@ds041367.mlab.com:41367/heroku_h2hgx19t, function (err, database) {	
if (err) {
console.log(err);
process.exit(1);
}
//Save database object from the callback for reuse.
db = database;
console.log("Database connection ready");
});
*/
//Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
var port = server.address().port;
console.log("App now running on port", port);

});


//define mongoose for storing sessions
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://heroku_h2hgx19t:mtem5s55c2ek42eqqfsecd07si@ds041367.mlab.com:41367/heroku_h2hgx19t', {
	useNewUrlParser: true
});
mongoose.Promise = global.Promise;
const mongoose_db = mongoose.connection


var routes = require('./api/routes/coronaRoutes');

routes(app);


//Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
console.log("ERROR: " + reason);
res.status(code || 500).json({"error": message});
}
