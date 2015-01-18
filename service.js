var debug = require('debug')('DJ-Infinity:server');
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
    };
    
    this.deleteDj = function (db, djName, doneCallback) {
        db.query('SELECT id FROM `djs` WHERE name = ?', djName, function (err, result) {
            if (err)
                throw err;
            
            var firstQueryDone = false;
            var djId = result[0]['id'];
            db.query('DELETE FROM `djs` WHERE id = ?', djId, function (err, result) {
                if (err)
                    throw err;

                if (firstQueryDone)
                    doneCallback();
                firstQueryDone = true;
            });
            db.query('DELETE FROM `songs` WHERE djid = ?', djId, function (err, result) {
                if (err)
                    throw err;
                
                if (firstQueryDone)
                    doneCallback();
                firstQueryDone = true;
            });
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
    };
    
    this.getSongs = function (db, djName, doneCallback) {
        db.query('SELECT id FROM `djs` WHERE name = ?', djName, function (err, result) {
            if (err)
                throw err;
            
            var djId = db.escape(result[0]['id']);
            db.query('SELECT name, album, artist FROM `songs` WHERE djid = ?', djId, function (err, result) {
                if (err)
                    throw err;
                
                doneCallback(result);
            });
        });
    };
    
    this.purgeDatabase = function () {
        var db = this.connectDb();
        db.query('TRUNCATE TABLE `djs`', function (err, result) { });
        db.query('TRUNCATE TABLE `songs`', function (err, result) { });
        db.end();
    }
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
    
    var sendMessage = function (json) {
        socket.write(JSON.stringify(json) + "\r\n");
    }
    
    this.sendDjSongRequest = function (songName, artistName) {
        console.log('senddjsongrequest: ' + songName + ' ' + artistName);

        var message = { message: 'user wants a song', songname: songName, artistname: artistName };
        sendMessage(message);
    };
    
    var onLineReceived = function (line) {
        console.log(line);
        var message;
        try {
            message = JSON.parse(line);
        }
        catch (ex) {
            console.log('invalid JSON received: ' + ex);
            return;
        }
        
        switch (message['message']) {
            case 'i am a dj':
                djName = message['name'];
                if (djName == undefined) {
                    console.log('invalid dj name');
                    return;
                }
                handlerMap[djName] = self;
                backend.createNewDJ(db, djName);
//                onLineReceived('{"message":"user wants a song","djname":"' + djName + '","songname":"Amerika","songartist":"Rommstein"}');
                break;

            case 'songs':
                backend.addSongs(db, djName, message['songs']);
                break;

            case 'user wants a song':
                var djHandler = handlerMap[message['djname']];
                djHandler.sendDjSongRequest(message['songname'], message['songartist']);
                break;

            case 'dj songs':
                var songs = backend.getSongs(db, message['djname'], function (songs) {
                    var message = { message: 'songs', songs: songs };
                    sendMessage(message);
                });
                break;

            default:
                console.log('unrecognized message');
                break;
        }
    };
    
    var onDone = function () {
        if (djName != undefined) {
            delete handlerMap[djName];
        }
        backend.deleteDj(db, djName, function () {
            db.end();
        });
    }
    
    var onError = function (ex) {
        console.log('error in socket: ' + ex);
        onDone();
    }

    buffer.on('line', onLineReceived);

    socket.setEncoding('utf-8');
    socket.on('data', buffer.addData);
    socket.on('end', onDone);
    socket.on('error', onError);

    console.log('connection');
}

module.exports = exports = function (socket) {
    if (socket == undefined) {
        return backend;
    }
    else {
        return new Handler(socket);
    }
};