/**
 * Created by Jonathan on 19/07/2016.
 */
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8087}),CLIENTS=[];
var messages = [];

wss.on('connection', function(ws) {
    CLIENTS.push(ws);
    console.log("connection open");
    console.log(ws.cookie);

    ws.on('message', function(message) {

        console.log('received: %s');
        sendAll(message);


    });
    ws.send("Conectado...");

});

function sendAll (message) {
    for (var i=0; i<CLIENTS.length; i++) {
        CLIENTS[i].send(message);
        // console.log(message)
    }
}
