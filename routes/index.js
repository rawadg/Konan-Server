import getAll from '../persistence/db.js';
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getAll', async function(req, res, next) {
  try {
    const graph = await getAll();
    res.send(graph);
  } catch(err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = router;
