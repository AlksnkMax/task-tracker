var User = require('../models/user');
var Project = require('../models/project');
var fs = require('fs');
var apiController = {};

apiController.getProjectList = function (req, res) {
  var obj = req.user.isManager ? {'author': req.user._id} : {'devs': {'_id': req.user._id}}
  Project.find(obj).populate('author').exec(function(err, projects) {
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
    .populate('author tasks.author tasks.comments.author')
    .exec(function(err, project) {
        if (err) return console.error(err);
        res.send(project.tasks);
  });
};

apiController.createTask = function (req, res) {
  var dev = !req.user.isManager ? req.user : undefined;
  Project.findByIdAndUpdate(
    req.body._id,
    { $push: {'tasks': { 'taskName': req.body.taskName, 'author': dev } } },
    function(err, project) {

    if (err) return console.error(err);
    apiController.getTaskList(req, res);
  });
};

apiController.updateTaskAuthor = function (req, res) {
  Project.findById(req.body.projectId)
  .populate('tasks.author')
  .exec(function(err, project) {
    if (project.tasks)
      project.tasks.forEach(function(task){
        if (task.author && (task.author.email == req.body.email)) {
          task.set('author', undefined);
        }
      });
    project.save(function(err){
      if (err) return console.error(err);
      res.send({});
    });
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
            'date': req.body.date,
            'author': req.user
          });
        project.save(function(err){
      		if (err) return console.error(err);
          apiController.getCommentList(req, res);
      	});
  });
};

apiController.getUser = function (req, res) {
  res.send(req.user);
};

apiController.getDevListInProject = function (req, res, call) {
  var proj = {};
  var promise = new Promise(function(resolve) {
    Project.findById(req.body.projectId)
      .populate('devs')
      .exec(function(err, project) {
          if (err) return console.error(err);
          proj = project;
          if (call != true) {
            res.send(project.devs ? project.devs : []);
          }
          resolve(proj.devs)
    });
  });
  return promise;
};

apiController.getDevList = function (req, res) {
  apiController.getDevListInProject(req,null,true).then(function(devsInProject) {
    User.find({'isManager': false})
      .exec(function(err, devs) {
          if (err) return console.error(err);
          if (devsInProject)
            for (i = 0; i < devsInProject.length; i++)
              for (j = 0; j < devs.length; j++) {
                if (devsInProject[i]._id.toString() === devs[j]._id.toString()) {
                  devs.splice(j, 1);
                  j--;
                }
              }
          res.send(devs);
        });
  });
};

apiController.addDeveloper = function (req, res) {
  User.findOne({'email': req.body.email}).exec(function(err, dev) {
    if (!dev || dev.isManager) return;
    Project.findById(req.body.projectId)
      .exec(function(err, project) {
          if (err) return console.error(err);
          project.devs.push(dev);
          project.save(function(err){
        		if (err) return console.error(err);
            apiController.getDevListInProject(req, res);
        	});
    });
  });
};

apiController.removeDeveloper = function (req, res) {
  Project.findById(req.body.projectId)
    .exec(function(err, project) {
        if (err) return console.error(err);
        for (var i = 0; i < project.devs.length-1; i++) {
          if (project.devs[i].email == req.body.email)
            break;
        }
        project.devs.splice(i, 1);
        project.save(function(err){
      		if (err) return console.error(err);
          apiController.getDevListInProject(req, res);
      	});
  });
};

apiController.addDevForTask = function (req, res) {
  User.findOne({'email': req.body.email}).exec(function(err, dev) {
    if (!dev || dev.isManager) return;
    Project.findById(req.body.projectId)
      .exec(function(err, project) {
          if (err) return console.error(err);
          project.tasks.id(req.body.taskId).author = dev;
          project.save(function(err){
        		if (err) return console.error(err);
            res.send(dev);
        	});
    });
  });
};

apiController.finishTask = function (req, res) {
  Project.findById(req.body.projectId)
    .exec(function(err, project) {
        if (err) return console.error(err);
        project.tasks.id(req.body.taskId).isFinished = true;
        project.save(function(err){
      		if (err) return console.error(err);
          res.send({'isFinished': true});
      	});
  });
};

module.exports = apiController;
