const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');

const Courses = require('../models/Course');

const advancedResults = require('../middleware/advancedResults');

//We are including this as a resource router in bootcamps so we add {mergeParams: true}
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Courses, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(createCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
