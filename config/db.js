const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hcqem.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log(
    'Connected to MongoDB: '.green + `${conn.connection.host}`.green.inverse
  );
};

module.exports = connectDB;
