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
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
