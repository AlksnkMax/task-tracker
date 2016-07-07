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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ProjectBox = undefined;

	var _modal = __webpack_require__(2);

	var ProjectBox = React.createClass({
	  displayName: 'ProjectBox',

	  loadProjectsFromServer: function loadProjectsFromServer() {
	    $.ajax({
	      url: '/api/getProjectList',
	      dataType: 'json',
	      cache: false,
	      success: function (data) {
	        this.setState({ data: data });
	      }.bind(this),
	      error: function (xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	  },
	  handleProjectSubmit: function handleProjectSubmit(project) {
	    project.projectName = project.title;
	    var projects = this.state.data;
	    project._id = Date.now();
	    var newProjects = projects.concat([project]);
	    this.setState({ data: newProjects });
	    $.ajax({
	      url: '/api/createProject',
	      dataType: 'json',
	      type: 'POST',
	      data: {
	        'projectName': project.title
	      },
	      success: function (data) {
	        this.setState({ data: data });
	      }.bind(this),
	      error: function (xhr, status, err) {
	        this.setState({ data: projects });
	      }.bind(this)
	    });
	  },
	  getInitialState: function getInitialState() {
	    return { data: [] };
	  },
	  componentDidMount: function componentDidMount() {
	    this.loadProjectsFromServer();
	    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'commentBox' },
	      React.createElement(
	        'h2',
	        null,
	        'Projects'
	      ),
	      React.createElement(_modal.ModalButton, { onSubmit: this.handleProjectSubmit }),
	      React.createElement(ProjectList, { data: this.state.data })
	    );
	  }
	});

	var ProjectList = React.createClass({
	  displayName: 'ProjectList',

	  render: function render() {
	    var projectNodes = this.props.data.map(function (project) {
	      return React.createElement(Project, { key: project._id, title: project.projectName });
	    });
	    return React.createElement(
	      'div',
	      { className: 'projectList' },
	      projectNodes
	    );
	  }
	});

	var Project = React.createClass({
	  displayName: 'Project',

	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'project' },
	      React.createElement(
	        'h3',
	        { className: 'projectName' },
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

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Modal = React.createClass({
	  displayName: 'Modal',

	  getInitialState: function getInitialState() {
	    return {
	      visible: false,
	      cancel_title: 'Cancel',
	      action_title: 'Ok',
	      title: '',
	      text: ''
	    };
	  },
	  // Обработчик закрытия модального окна, вызовет обработчик отказа
	  close: function close() {
	    this.setState({
	      visible: false,
	      title: ''
	    }, function () {
	      return this.promise.reject();
	    });
	  },
	  // Обработчик действия модального окна, вызовет обработчик действия
	  action: function action() {
	    this.props.onSubmit({ title: this.state.title });
	    this.setState({
	      visible: false,
	      title: ''
	    }, function () {
	      return this.promise.resolve();
	    });
	  },
	  // Обработчик открытия модального окна. Возвращает promise
	  // ( при желании, можно передавать также названия кнопок )
	  open: function open(text) {
	    this.setState({
	      visible: true,
	      text: text
	    });

	    // promise необходимо обновлять при каждом новом запуске окна
	    this.promise = new $.Deferred();
	    return this.promise;
	  },
	  handleTitleChange: function handleTitleChange(e) {
	    this.setState({ title: e.target.value });
	  },
	  render: function render() {
	    var modalClass = this.state.visible ? "modal fade in" : "modal fade";
	    var modalStyles = this.state.visible ? { display: "block" } : {};
	    var backdrop = this.state.visible ? React.createElement('div', { className: 'modal-backdrop fade in', onClick: this.close, style: { zIndex: "1" } }) : null;

	    var title = this.state.title ? React.createElement(
	      'div',
	      { className: 'modal-header' },
	      React.createElement(
	        'h4',
	        { className: 'modal-title' },
	        this.state.title
	      )
	    ) : null;

	    return React.createElement(
	      'div',
	      { className: modalClass, style: modalStyles },
	      backdrop,
	      React.createElement(
	        'div',
	        { className: 'modal-dialog', style: { zIndex: "2" } },
	        React.createElement(
	          'div',
	          { className: 'modal-content' },
	          this.state.text,
	          React.createElement('input', {
	            className: 'form-control',
	            type: 'text',
	            value: this.state.title,
	            onChange: this.handleTitleChange
	          }),
	          React.createElement(
	            'div',
	            { className: 'modal-footer' },
	            React.createElement(
	              'button',
	              { type: 'button', className: 'btn btn-default',
	                onClick: this.close },
	              this.state.cancel_title
	            ),
	            React.createElement(
	              'button',
	              { type: 'button', className: 'btn btn-primary',
	                onClick: this.action },
	              this.state.action_title
	            )
	          )
	        )
	      )
	    );
	  }
	});

	var ModalButton = React.createClass({
	  displayName: 'ModalButton',

	  popup: function popup() {
	    this.refs.foo.open();
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'a',
	        { onClick: this.popup, className: 'btn btn-primary' },
	        'Create project'
	      ),
	      React.createElement(Modal, { ref: 'foo', onSubmit: this.props.onSubmit })
	    );
	  }
	});

	exports.ModalButton = ModalButton;

/***/ }
/******/ ]);