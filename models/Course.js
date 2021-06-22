const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Course title is required'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Course description is required'],
  },
  weeks: {
    type: String,
    required: [true, 'Course duration (weeks) is required'],
  },
  tuition: {
    type: Number,
    required: [true, 'Tution cost required'],
  },
  minimumSkill: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [true, 'Minimum skill is required'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
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

// Static method to get average of tuition
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {}
};

// Call getAverageCost after 'save'
CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before 'remove'
CourseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
