'use strict';

require('dotenv').config();

// Start up DB Server
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGOOSE_URI, options);

// Start the web server
require('./src/server.js').start(process.env.PORT);

// 'use strict';

// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/food', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const server = require('./src/server.js');

// server.start(3000);