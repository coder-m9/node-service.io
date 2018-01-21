let express = require('express');
let trailerController = require('../controllers/trailers');

const router = express.Router();

router.get('/trailers', trailerController.fetchTrailerURL);

module.exports = router;
