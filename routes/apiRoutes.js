var express = require('express');
var router = express.Router();
var apiController = require('../controllers/apiController');

router.post('/createProject', apiController.createProject);

router.get('/getProjectList', apiController.getProjectList);

router.post('/getTaskList', apiController.getTaskList);

router.post('/createTask', apiController.createTask);

router.post('/updateTaskAuthor', apiController.updateTaskAuthor);

router.post('/getCommentList', apiController.getCommentList);

router.post('/addComment', apiController.addComment);

router.get('/getUser', apiController.getUser);

router.post('/addDeveloper', apiController.addDeveloper);

router.post('/removeDeveloper', apiController.removeDeveloper);

router.post('/getDevList', apiController.getDevList);

router.post('/getDevListInProject', apiController.getDevListInProject);

router.post('/addDevForTask', apiController.addDevForTask);

router.post('/finishTask', apiController.finishTask);

module.exports = router;
