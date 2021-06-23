const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Review title is required'],
    maxlength: [100, 'Review title cannot exceed 100 characters'],
  },
  text: {
    type: String,
    trim: true,
    required: [true, 'Review text is required'],
  },
  rating: {
    type: Number,
    min: [1, 'Minimum rating of 1 is required'],
    max: [10, 'Maximum rating cannot exceed 10'],
    required: [true, 'Rating (1-10) is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
