const express = require('express');
const cors = require('cors');
const postsRouter = require('./routes/posts');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/posts', postsRouter);

  app.use((err, req, res, _next) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(err);
    }
    res.status(500).json({ message: 'Unable to fetch posts at this time.' });
  });

  return app;
}

module.exports = createApp;
