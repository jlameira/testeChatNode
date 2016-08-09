'use strict';
const async = require('async');
var soq = require('../events/imagemSentinelUm').sentinelUm;
const express = require('express');
var request = require('request');
var http = require("http");
var Agent = require('agentkeepalive');
var DOMParser = require('xmldom').DOMParser;
var parseString = require('xml2js').parseString;


var keepaliveAgent = new Agent({
  maxSockets: 100,
  maxFreeSockets: 10,
  timeout: 60000,
  keepAliveTimeout: 30000 // free socket keepalive for 30 seconds
});


const options = [{
  host : "10.15.100.74",
  port: 8601,
  path: '/Interface/LPR/MonitorEvents?ResponseFormat=XML&KeepAliveInterval=30&AuthUser=admin&AuthPass=dts3@2014',
  AuthUser: 'admin',
  AuthPass:'dts3@2014',
  method: 'GET',
  agent: keepaliveAgent
},
  {
    host : "10.73.142.109",
    port: 8601,
    path: '/Interface/LPR/MonitorEvents?ResponseFormat=XML&KeepAliveInterval=30&AuthUser=admin&AuthPass=abc123@',
    AuthUser: 'admin',
    AuthPass:'abc123@',
    method: 'GET',
    agent: keepaliveAgent
  }
];

async.map(options, function (options,callback) {
  var req = http.request(options, function (res) {
    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      // console.log('BODY: ' + chunk);

      var cleanedString = chunk.split(" ?>");
      var json;
      // var doc = new DOMParser().parseFromString(chunk, 'text/xml');
      parseString(cleanedString[1], function (err, result) {

        if (err) {
          console.log(err)
        } else {
          json = JSON.stringify(result);
          // json.host = host1;
          console.log(JSON.stringify(result));
        }
      });

      if(json !== 'undefined') {
        var naoleu = JSON.parse(json);
        naoleu.servidor = options.host;
        naoleu.AuthUser = options.AuthUser;
        naoleu.AuthPass = options.AuthPass;


        if (naoleu.Response.Data[0].Event[0].EventData[0].Type != 'KEEP_ALIVE') {
          soq.emit('imageSentinelUm', naoleu);
        }
      }


    })});
  req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
  });
  req.end();

}, function(err, results) {
  // completion function
  if (!err) {
    // process all results in the array here
    console.log(results);
    for (var i = 0; i < results.length; i++) {
      // do something with results[i]
    }
  } else {
    // handle error here
  }
});



// setTimeout(function () {
//   console.log('keep alive sockets:');
//   console.log(keepaliveAgent.unusedSockets);
// }, 30000);

