const router = require('express').Router();
const {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadBootcampImage,
} = require('../controllers/bootcamps');
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const courseRouter = require('./courses');

// Re-route to other resource routes
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router
  .route('/')
  .get(
    advancedResults(Bootcamp, { path: 'courses', select: 'title' }),
    getBootcamps
  )
  .post(createBootcamp);
router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);
router.route('/:id/image').put(uploadBootcampImage);

module.exports = router;
