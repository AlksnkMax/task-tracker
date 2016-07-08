var User = require('../models/user');
var Project = require('../models/project');
var fs = require('fs');
var apiController = {};

apiController.getProjectList = function (req, res) {
  Project.find({}, function(err, projects) {
    var projectMap = [];
    projects.forEach(function(project) {
      projectMap.push(project);
    });
    res.send(projectMap);
  });
};

apiController.createProject = function (req, res) {
	var newProject = new Project();
	newProject.projectName = req.body.projectName;
	newProject.author = req.user;
	newProject.save(function(err){
		if (err) return console.error(err);
    apiController.getProjectList(req, res);
	});
};

apiController.getTaskList = function (req, res) {
  Project.findById(req.body._id)
    .populate('author')
    .exec(function(err, project) {
        if (err) return console.error(err);
        res.send(project.tasks);
  });
};

apiController.createTask = function (req, res) {
  Project.findByIdAndUpdate(
    req.body._id,
    { $push: {'tasks': { 'taskName': req.body.taskName, 'author': req.user } } },
    function(err, project) {

    if (err) return console.error(err);

    apiController.getTaskList(req, res);
  });
};

apiController.getCommentList = function (req, res) {
    Project.findById(req.body.projectId)
    .select('tasks._id tasks.comments')
    .populate('author tasks.author tasks.comments.author')
    .exec(function (err, project) {
      if (err) return console.log(err);
      project.tasks.forEach(function(item) {
        if (item._id == req.body.taskId) {
          res.send(item.comments)
        }
      });
  });
};

apiController.addComment = function (req, res) {
  Project.findById(req.body.projectId)
    .populate('author')
    .exec(function(err, project) {
        if (err) return console.error(err);
        project.tasks.id(req.body.taskId).comments.push(
          {
            'text': req.body.comment,
            'author': req.user
          });
        project.save(function(err){
      		if (err) return console.error(err);
          apiController.getCommentList(req, res);
      	});
  });
};

module.exports = apiController;
