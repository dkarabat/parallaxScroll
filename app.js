/**
 * Module dependencies.
 */

var options = {
    'log level': 3
};

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http'), http = require('http')
    , mongoose = require('mongoose')
    , path = require('path');


// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://user:111111@ds051170.mongolab.com:51170/heroku_app29493879', function (error) {
    if (error) {
        console.log(error);
    }
});

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    nick_name: String,
    message_text: String
});
var User = mongoose.model('users', UserSchema);


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
//app.engine('.html', require('jade').__express);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));

});

var io = require('socket.io').listen(server, options);

io.sockets.on('connection', function (client) {
    client.on('message', function (message) {
        try {
            var userChat = new User({nick_name: message.name, message_text: message.message });
            //userChat.speak();
            userChat.save(function (err, userChat) {
                if (err) return console.error(err);
                //userChat.speak();
            });
            client.emit('message', message);
            client.broadcast.emit('message', message);
        } catch (e) {
            console.log(e);
            client.disconnect();
        }
    });
});
