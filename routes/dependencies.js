var express = require('express');
var router = express.Router();
import NeuralService from '../services/neuralService';


/* GET dependencies listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
