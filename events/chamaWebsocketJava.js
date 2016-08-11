/**
 * Created by jonathanlameira on 05/08/16.
 */


var WebSocket = require('ws');
var ws;
var EventEmitter = require('events').EventEmitter;
var chamarSocket = new EventEmitter();
var buffer = [];

function connectSocketJava() {
    ws = new WebSocket("ws://localhost:8080/helios/recebecarros");
    // ws  = new WebSocket("ws://localhost:8087/");

    ws.binaryType = "arraybuffer";
    ws.onopen = function () {
        console.log("Connected.");
        for (var i = 0; i < buffer.length; i++) {
            var data = buffer[i].data;
            ws.send(data);
        }
        buffer = [];
    };


    ws.onmessage = function (evt) {
        console.log(evt.msg);

    };

    ws.onclose = function () {
        console.log("Connection is closed...");
    };
    ws.onerror = function (e) {
        console.log(e.msg);
    }

};

chamarSocket.on('enviadorSocket', function (dados) {
    // var info = JSON.parse(dados);
    if (ws.readyState == WebSocket.OPEN) {
        /*  Proxy data to outgoing websocket to the backend content server.  */
        ws.send(JSON.stringify(dados));
    } else {
        if (buffer.length < 5) {
            buffer.push({data: JSON.stringify(dados)})
        }
    }

});

connectSocketJava();
module.exports.chamarSocket = chamarSocket;