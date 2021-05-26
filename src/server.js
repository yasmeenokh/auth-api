'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');

const v2Routes = require('./routes/v2');
const v1Routes = require('./routes/v1');
const authRoutes = require('./auth/routes.js');

const app = express();
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.use(v2Routes);
app.use(v1Routes);

app.use(authRoutes);


app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error("Missing Port"); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};

// module.exports = {
//   server: app,
//   start: (port) => {
//     app.listen(port, () => {
//       console.log(`Server Up on ${port}`);
//     });
//   },
// };