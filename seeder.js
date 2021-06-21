const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load Models
const Bootcamp = require('./models/Bootcamp');

// Connect to DB
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hcqem.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('Data imported...'.cyan.bold);
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Data destroyed...'.red.bold);
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
