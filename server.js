const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route Files
const bootcamps = require('./routes/bootcamps');

const app = express();

// Body Parser
app.use(express.json());

// Dev Logger Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in env ${process.env.NODE_ENV} mode on port ${PORT}`.blue
      .bold.underline
  )
);

// Handle unhandled rejections
process.on('unhandled rejection', (err, promise) => {
  console.log(`Error: ${err.message}.red.underline.bold`);
  // Close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
