const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load Environment
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Devnet!');
});

// Mounting Routers
app.use('/api/v1/bootcamps', require('./routes/bootcamps'));
app.use('/api/v1/courses', require('./routes/courses'));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, console.log(`Listening on PORT: ${PORT}`.blue));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server and exit process
  server.close(() => process.exit(1));
});
