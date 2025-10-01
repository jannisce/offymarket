const express = require('express');
const { getPostsSummary } = require('../services/postsService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { name } = req.query;
    const summary = await getPostsSummary(name);
    res.json(summary);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
