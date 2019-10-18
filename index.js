var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/www'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/www/index.html");
});
var authentication = [
  "KHCKV3KJ234KLH435KH24356KH2KHN3H23K54KK", //ID = 0
  "NBN234NB435UY4325N2CB45UCUYUYBN34NV23BN"  //ID = 1
];
var msgProps = ["id","lat","lng","text","color","carType","speed","status","statusColor","origin","destination","eta","img"];
io.on('connection', function (socket) {
  socket.on("update", function(msg) {
    if(!msg.hasOwnProperty("key")) {
      socket.emit("response","Missing Authorization Key");
      return;
    }
    if(!msgProps.every(function(x) { return x in msg })) {
      socket.emit("response", "Missing Message Data");
      return;
    }
    if(msg.key !== authentication[msg.id]) {
      socket.emit("response","Invalid Authorization Key");
      return;
    }
    delete msg.key; //Don't pass along the key - throw it away
    socket.broadcast.emit("update", msg);
    socket.emit("response","Success");
  });
});
server.listen(8080, function () {
    console.log('listening on *:8080');
});
