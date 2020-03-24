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
    const grapJson = JSON.stringify(graph, mapReplacer);
    res.setHeader('Content-Type', 'application/json');
    res.send(grapJson);
  } catch(err) {
    console.log(err);
    res.status(500).send();
  }
});

function mapReplacer(key, value) {
  if ( value instanceof Map) {
    return [...value];
  }
  return value;
}


module.exports = router;
