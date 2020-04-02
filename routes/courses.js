const express = require('express');
const { getCourses } = require('../controllers/courses');

//We are including this as a resource router in bootcamps so we add {mergeParams: true}
const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses);

module.exports = router;
