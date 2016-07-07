/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _projects = __webpack_require__(1);

	ReactDOM.render(React.createElement(_projects.ProjectBox, { url: "/api/comments", pollInterval: 2000 }), document.getElementById('content'));

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ProjectBox = React.createClass({
	  displayName: "ProjectBox",

	  handleProjectSubmit: function handleProjectSubmit(project) {
	    var projects = this.state.data;
	    project.id = Date.now();
	    var newProjects = projects.concat([project]);
	    this.setState({ data: newProjects });
	  },
	  getInitialState: function getInitialState() {
	    return { data: [] };
	  },
	  /*componentDidMount: function() {
	    this.loadProjectsFromServer();
	    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	  },*/
	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "commentBox" },
	      React.createElement(
	        "h2",
	        null,
	        "Projects"
	      ),
	      React.createElement(ProjectList, { data: this.state.data }),
	      React.createElement(ProjectForm, { onProjectSubmit: this.handleProjectSubmit })
	    );
	  }
	});

	var ProjectList = React.createClass({
	  displayName: "ProjectList",

	  render: function render() {
	    var projectNodes = this.props.data.map(function (project) {
	      return React.createElement(Project, { key: project.id, title: project.title });
	    });
	    return React.createElement(
	      "div",
	      { className: "projectList" },
	      projectNodes
	    );
	  }
	});

	var ProjectForm = React.createClass({
	  displayName: "ProjectForm",

	  getInitialState: function getInitialState() {
	    return { title: '' };
	  },
	  handleTitleChange: function handleTitleChange(e) {
	    this.setState({ title: e.target.value });
	  },
	  handleSubmit: function handleSubmit(e) {
	    e.preventDefault();
	    var title = this.state.title.trim();
	    if (!title) {
	      return;
	    }
	    this.props.onProjectSubmit({ title: title });
	    this.setState({ title: '' });
	  },
	  render: function render() {
	    return React.createElement(
	      "form",
	      { className: "projectForm", onSubmit: this.handleSubmit },
	      React.createElement("input", {
	        type: "text",
	        placeholder: "The name of the project",
	        value: this.state.title,
	        onChange: this.handleTitleChange
	      }),
	      React.createElement("input", { type: "submit", value: "Post" })
	    );
	  }
	});

	var Project = React.createClass({
	  displayName: "Project",

	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "project" },
	      React.createElement(
	        "h3",
	        { className: "projectName" },
	        this.props.title
	      )
	    );
	  }
	});

	exports.ProjectBox = ProjectBox;

	/*ReactDOM.render(
	  <ProjectBox url="/api/comments" pollInterval={2000} />,
	  document.getElementById('content')
	);*/

/***/ }
/******/ ]);