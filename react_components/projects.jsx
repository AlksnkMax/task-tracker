var ProjectBox = React.createClass({
  handleProjectSubmit: function(project) {
    var projects = this.state.data;
    project.id = Date.now();
    var newProjects = projects.concat([project]);
    this.setState({data: newProjects});
  },
  getInitialState: function() {
    return {data: []};
  },
  /*componentDidMount: function() {
    this.loadProjectsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },*/
  render: function() {
    return (
      <div className="commentBox">
        <h2>Projects</h2>
        <ProjectList data={this.state.data} />
        <ProjectForm onProjectSubmit={this.handleProjectSubmit} />
      </div>
    );
  }
});

var ProjectList = React.createClass({
  render: function() {
    var projectNodes = this.props.data.map(function(project) {
      return (
        <Project key={project.id} title={project.title}>
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

var ProjectForm = React.createClass({
  getInitialState: function() {
    return {title: ''};
  },
  handleTitleChange: function(e) {
    this.setState({title: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.state.title.trim();
    if (!title) {
      return;
    }
    this.props.onProjectSubmit({title: title});
    this.setState({title: ''});
  },
  render: function() {
    return (
      <form className="projectForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="The name of the project"
          value={this.state.title}
          onChange={this.handleTitleChange}
        />
        <input type="submit" value="Post" />
      </form>
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
