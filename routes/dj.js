var express = require('express');
var router = express.Router();

// 37642
router.get('/', function (req, res, next) {
    

    res.json({ good: true });
});

module.exports = router;
