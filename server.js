const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

// Body Parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev Logger Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File upload
app.use(fileupload());

// Mongo Sanitize, sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent cross site scripting
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORs policy
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// Error Handler Middleware
app.use(errorHandler);

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
