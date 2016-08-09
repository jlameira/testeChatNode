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

module.exports.ImageCarUm = function (imagem) {
    var img;
    chunck = imagem;

    recordNumber = imagem.Response.Data[0].Event[0].EventData[0].RecordNumber[0];

    var d = Q.defer();

    request({
        url: 'http://10.15.100.74:8601/Interface/LPR/GetRecordImage?RecordNumber='+ recordNumber+'&AuthUser=admin&AuthPass=dts3@2014&',
        method: 'GET',
    }, function (error, response, body) {

        if (error) {
            console.log(error.message);
            d.reject(error);
        } else {

            // console.log(this.response.body);

            // img =  JSON.stringify(body);
            chunck.imagem = body;
            connect.emit('enviadorSocket',chunck);

            d.resolve(body);

        }
    });


    return d.promise
}



function a() {

}

module.exports.xxxx = a