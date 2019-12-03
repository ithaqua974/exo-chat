var express = require('express');

var app = express();

var http = require('http').Server(app);

var server = http.listen(3000, () => {
    console.log('server is runnig', server.address().port);
});

app.use(express.static(__dirname));

var mongoose = require('mongoose');

var dbUrl = 'mongodb://localhost:27017/simple_chat'

mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connected', err);
})

var Message = mongoose.model('Message', {
    name: String,
    message: String
})
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err)
            sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })
})


var io = require('socket.io')(http);

io.on('connection', () => {
    console.log('a user is connected')
})