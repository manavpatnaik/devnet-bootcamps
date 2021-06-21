const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');

// Load Environment
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Devnet!');
});

// Mounting Routers
app.use('/api/v1/bootcamps', require('./routes/bootcamps'));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, console.log(`Listening on PORT: ${PORT}`.blue));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server and exit process
  server.close(() => process.exit(1));
});
