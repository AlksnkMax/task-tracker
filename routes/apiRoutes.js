var express = require('express');
var router = express.Router();
var apiController = require('../controllers/apiController');

router.post('/createProject', apiController.createProject);

router.get('/getProjectList', apiController.getProjectList);

router.post('/getTaskList', apiController.getTaskList);

router.post('/createTask', apiController.createTask);

router.post('/getCommentList', apiController.getCommentList);

router.post('/addComment', apiController.addComment);

module.exports = router;
