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

// Static method to get average of rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// Call getAverageRating after 'save'
ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageRating before 'remove'
ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

// One user => one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
