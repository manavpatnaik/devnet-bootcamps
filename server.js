const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');

// Load Environment
dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Devnet!');
});

// Mounting Routers
app.use('/api/v1/bootcamps', require('./routes/bootcamps'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Listening on PORT: ${PORT}`.blue));
