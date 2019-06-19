const express = require('express');
const router = new express.Router();

router.get('*', function(req, res) {
    res.send('Incorrect route')
})

module.exports = router;