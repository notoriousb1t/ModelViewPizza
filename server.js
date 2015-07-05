/// <reference path="typings/node/node.d.ts"/>
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(3001);