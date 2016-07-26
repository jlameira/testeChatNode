/**
 * Created by Jonathan on 19/07/2016.
 */
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8087});
var messages = [];
wss.on('connection', function(ws) {
    console.log("connection open");
    ws.on('message', function(message) {

        console.log('received: %s', message);
        ws.send("bytes received: " + message.length);

        //wss.clients.forEach(function(conn){
        //    conn.send(message);
        //
        //});
    });
});
