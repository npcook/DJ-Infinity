var debug = require('debug')('DJ-Infinity:server');

var Handler = function (socket) {
    this.socket = socket;

    this.onData = function (data) {
        socket.write(data);
    }

    this.socket.setEncoding('utf-8');
    this.socket.on('data', this.onData);
        
    this.socket.write('you got it');
}

module.exports = exports = function (socket) { return new Handler(socket); };