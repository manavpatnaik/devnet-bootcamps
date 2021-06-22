const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course)
    return next(
      new ErrorResponse(`Course with id: ${req.params.id} not found`, 404)
    );

  res.status(200).json({ success: true, data: course });
});

// @desc    Create a course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.body.bootcamp);
  if (!bootcamp)
    return next(
      new ErrorResponse(`No bootcamp with id: ${req.body.bootcamp}`, 404)
    );

  // Check if bootcamp owner is the logged in user
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User: ${req.user.id}, is not authorized to create courses for this bootcamp: ${bootcamp.id}`,
        401
      )
    );
  }

  const course = await Course.create(req.body);
  res.status(200).json({ success: true, data: course });
});

// @desc    Update a course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course)
    return next(new ErrorResponse(`No course with id: ${req.params.id}`, 404));

  // Check if course owner is the logged in user
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User: ${req.user.id}, is not authorized to update course: ${course._id}`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

// @desc    Delete a course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course)
    return next(new ErrorResponse(`No course with id: ${req.params.id}`, 404));

  // Check if course owner is the logged in user
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User: ${req.user.id}, is not authorized to delete course: ${course._id}`,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({ success: true, data: {} });
});
