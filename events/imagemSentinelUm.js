/**
 * Created by jonathanlameira on 04/08/16.
 */

var EventEmitter = require('events').EventEmitter;
var eventoz2 = new EventEmitter();
var Q = require('q');

var buscaImagem = require('../logicas/buscaImagemSentinelUm');
// var logica2 = require('logica2');

eventoz2.on('imageSentinelUm', function (chunk) {

    Q.when(buscaImagem.ImageCarUm(chunk), function (ok) {

       var imagem = JSON.stringify(ok);

        console.log('Tudo: ' + chunk.append(imagem));



    }, function (erro) {


    });

    console.log('dsfds')

});

module.exports.sentinelUm = eventoz2;
