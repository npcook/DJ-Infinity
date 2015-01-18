var express = require('express');
var service = require('../service');
var fs = require('fs');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var uri = url.parse(req.url).pathname;
    var filename = path.join(path.join(process.cwd(), 'public'), 'index.html');
    var stream = fs.createReadStream(filename);
    stream.pipe(res);
});

router.get('/library/:djname', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var db = service().connectDb();
    service().getSongs(db, req.params.djname, function (songs) {
        res.json(songs);
    });
});

router.get('/request/:djname/:songname/:artistname', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var handler = service().getDjHandler(req.params.djname);
    if (handler != undefined) {
        handler.sendDjSongRequest(req.params.songname, req.params.artistname);
    }
});

module.exports = router;
