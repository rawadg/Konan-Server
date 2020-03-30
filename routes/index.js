import {getFullGraph, getSubGraph} from '../persistence/db.js';
var express = require('express');
var router = express.Router();

router.get('/getFullGraph', async function(req, res, next) {
  try {
    const graph = await getFullGraph();
    res.send(graph);
  } catch(err) {
    console.log(err);
    next(err)
  }
});


router.get('/getSubGraph', async function(req, res, next) {
  try {
    const rootId = req.query.rootId;
    const graph = await getSubGraph(rootId);
    res.send(graph);
  } catch(err) {
    console.log(err);
    next(err)
  }
});

module.exports = router;
