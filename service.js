﻿var debug = require('debug')('DJ-Infinity:server');
var mysql = require('mysql');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Backend = function () {
    this.connectDb = function () {
        return mysql.createConnection({
            host: 'tinfinity.net',
            port: 3306,
            database: 'djinfinity',
            user: 'djinfinity',
            password: "Whit'smom",
        });
    };

    this.createNewDJ = function (db, name) {
        db.query('INSERT INTO `djs` (name) VALUES (?)', name, function (err, result) {
            if (err)
                throw err;


        });
    }
    
    this.addSongs = function (db, djName, songs) {
        db.query('SELECT id FROM `djs` WHERE name = ?', djName, function (err, result) {
            if (err)
                throw err;

            var djId = db.escape(result[0]['id']);
            var insertQuery = 'INSERT INTO `songs` (djid, name, artist, album) VALUES ';
            for (var i = 0; i < songs.length; ++i) {
                var song = songs[i];
                insertQuery += '(';
                insertQuery += djId + ',';
                insertQuery += db.escape(song['name']) + ',';
                insertQuery += db.escape(song['artist']) + ',';
                insertQuery += db.escape(song['album']);
                insertQuery += ')';
                insertQuery += ', ';
            }
            
            insertQuery = insertQuery.substr(0, insertQuery.length - 2);
            
            db.query(insertQuery);
        });
    }
    
    var _db = this.connectDb();
    _db.query('TRUNCATE TABLE `djs`');
    _db.query('TRUNCATE TABLE `songs`');
    _db.destroy();
};

var backend = new Backend();

var DataBuffer = function () {
    var buffer = '';
    var self = this;

    this.addData = function (data) {
        buffer = buffer + data;
        
        while (true) {
            var newLineIndex = buffer.indexOf('\r');
            if (newLineIndex == -1) {
                newLineIndex = buffer.indexOf('\n');
                if (newLineIndex == -1) {
                    return;
                }
            }
            
            var line = buffer.substr(0, newLineIndex);
            
            buffer = buffer.substr(newLineIndex + 1);
            if (buffer.length > 0 && buffer[0] == '\n')
                buffer = buffer.substr(1);
            
            self.emit('line', line);
        }
    };
}

util.inherits(DataBuffer, EventEmitter);

var handlerMap = {};

var Handler = function (socket) {
    var socket = socket;
    var buffer = new DataBuffer();
    var db = backend.connectDb();
    var djName = undefined;
    var self = this;
    
    this.sendDjSongRequest = function (name) {
        var message = { message: 'user wants a song', song: name };
        socket.write(JSON.stringify(message) + "\r\n");
    };
    
    var onLineReceived = function (line) {
        var message = JSON.parse(line);
        
        switch (message['message']) {
            case 'i am a dj':
                djName = message['name'];
                handlerMap[djName] = self;
                backend.createNewDJ(db, djName);
                onLineReceived('{"message":"user wants a song","djname":"' + djName + '","songname":"Amerika"}');
                break;

            case 'songs':
                backend.addSongs(db, djName, message['songs']);
                break;

            case 'user wants a song':
                var djHandler = handlerMap[message['djname']];
                djHandler.sendDjSongRequest(message['songname']);
                break;
        }
    };

    buffer.on('line', onLineReceived);

    socket.setEncoding('utf-8');
    socket.on('data', buffer.addData);
    socket.on('end', function () {
        if (djName != undefined) {
            delete handlerMap[djName];
        }
        db.destroy();
    })
        
    socket.write('you got it');

//    onLineReceived('{"message":"i am a dj","name":"cd"}');
//    onLineReceived('{"message":"user wants a song","djname":"cd","songname":"balls"}');
//    onLineReceived('{"message":"songs","songs":[{"name":"balls","album":"dicks","artist":"urmom"}]}');
}

module.exports = exports = function (socket) { return new Handler(socket); };