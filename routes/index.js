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

module.exports = router;
