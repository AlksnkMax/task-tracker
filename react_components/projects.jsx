import {ModalButton} from './modal.jsx';

var ProjectBox = React.createClass({
  loadProjectsFromServer: function() {
    $.ajax({
      url: '/api/getProjectList',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleProjectSubmit: function(project) {
    project.projectName = project.title;
    var projects = this.state.data;
    project._id = Date.now();
    var newProjects = projects.concat([project]);
    this.setState({data: newProjects});
    $.ajax({
      url: '/api/createProject',
      dataType: 'json',
      type: 'POST',
      data: {
        'projectName': project.title
      },
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: projects});
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {
      data: [],
      user: {isManager: false}
    };
  },
  componentDidMount: function() {
    this.loadProjectsFromServer();
    $.ajax({
      url: '/api/getUser',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({user: data});
        this.render();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var modal = this.state.user.isManager ? <ModalButton onSubmit={this.handleProjectSubmit} buttonTitle='Create project'
      windowTitle='Enter the name of the project'/> : '';
    return (
      <div className='project-container'>
        <h2>Projects</h2>
        {modal}
        <ProjectList data={this.state.data}/>
      </div>
    );
  }
});

var ProjectList = React.createClass({
  render: function() {
    var self = this;
    var projectNodes = this.props.data.map(function(project) {
      return (
        <Project key={project._id} title={project.projectName} project={project}>
        </Project>
      );
    });
    return (
      <div className="project-list">
        {projectNodes}
      </div>
    );
  }
});

var Project = React.createClass({
  handle: function() {
    PROJECT = this.props.project;
    window.setProject();
    window.location.href = '#/tasks';
  },
  render: function() {
    return (
      <div className="project" onClick={this.handle}>
        <a className="project-name">
          {this.props.title}
        </a>
      </div>
    );
  }
});



export {ProjectBox};
