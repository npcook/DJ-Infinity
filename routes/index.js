var express = require('express');
var service = require('../service');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/library/:djname', function (req, res, next) {
    var db = service().connectDb();
    service().getSongs(db, req.params.djname, function (songs) {
        res.json(songs);
    });
});

router.get('/request/:djname/:songname/:artistname', function (req, res, next) {
    var handler = service().getDjHandler(req.params.djname);
    if (handler != undefined) {
        handler.sendDjSongRequest(req.params.songname, req.params.artistname);
    }
});

module.exports = router;
