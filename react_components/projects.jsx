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
    return {data: []};
  },
  componentDidMount: function() {
    this.loadProjectsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h2>Projects</h2>
        <ModalButton onSubmit={this.handleProjectSubmit}/>
        <ProjectList data={this.state.data} />
      </div>
    );
  }
});

var ProjectList = React.createClass({
  render: function() {
    var projectNodes = this.props.data.map(function(project) {
      return (
        <Project key={project._id} title={project.projectName}>
        </Project>
      );
    });
    return (
      <div className="projectList">
        {projectNodes}
      </div>
    );
  }
});

var Project = React.createClass({
  render: function() {
    return (
      <div className="project">
        <h3 className="projectName">
          {this.props.title}
        </h3>
      </div>
    );
  }
});



export {ProjectBox};

/*ReactDOM.render(
  <ProjectBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);*/
