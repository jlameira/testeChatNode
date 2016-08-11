/**
 * Created by jonathanlameira on 04/08/16.
 */
var Q = require('q');
var request = require('request');
var fs = require('fs');
var xml2js = require('xml2js');
var DOMParser = require('xmldom').DOMParser;
var connect = require('../events/chamaWebsocketJava').chamarSocket;
var recordNumber;
var chunck ;

module.exports.ImageCarDois = function (imagem) {
    var img;
    chunck = imagem;

    recordNumber = imagem.Response.Data[0].Event[0].EventData[0].RecordNumber[0];

    var d = Q.defer();

    request({
        url: 'http://10.73.142.109:8601/Interface/LPR/GetRecordImage?AuthUser=admin&AuthPass=abc123@&RecordNumber=' + recordNumber,
        method: 'GET',
    }, function (error, response, body) {

        if (error) {
            console.log(error.message);
            d.reject(error);
        } else {
            console.log(body);

            // img =  JSON.stringify(body);
            chunck.imagem = body;
            connect.emit('enviadorSocket',chunck);

            d.resolve(body);

        }
    });


    return d.promise
}