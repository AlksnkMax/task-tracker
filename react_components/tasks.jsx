import {ModalButton} from './modal.jsx';
import {DevBox} from './devs.jsx';

var TaskBox = React.createClass({
  loadTasksFromServer: function() {
    if (PROJECT) {
      $.ajax({
        url: '/api/getTaskList',
        dataType: 'json',
        type: 'POST',
        data: {
          '_id': PROJECT._id
        },
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    } else {
      this.loadTasksFromServer();
    }
  },
  handleTaskSubmit: function(task) {
    task.taskName = task.title;
    var tasks = this.state.data;
    task._id = Date.now();
    var newTasks = tasks.concat([task]);
    this.setState({data: newTasks});
    $.ajax({
      url: '/api/createTask',
      dataType: 'json',
      type: 'POST',
      data: {
        'taskName': task.title,
        '_id': PROJECT._id
      },
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: tasks});
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
    this.loadTasksFromServer();
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
    return (
      <div className="task-box">
        <h2>{PROJECT.projectName}</h2>
        <DevBox isManager={this.state.user.isManager} loadTasks={this.loadTasksFromServer}/>
        <div className="task-title">
          <h3>Tasks</h3>
          <ModalButton onSubmit={this.handleTaskSubmit} buttonTitle='Create task' windowTitle='Enter the name of the task'/>
        </div>
        <TaskList data={this.state.data} />
      </div>
    );
  }
});

var TaskList = React.createClass({
  render: function() {
    var taskNodes = this.props.data.map(function(task) {
      return (
        <Task key={task._id} title={task.taskName} task={task}>
        </Task>
      );
    });
    return (
      <div className="task-list">
        {taskNodes}
      </div>
    );
  }
});

var Task = React.createClass({
  handle: function() {
    TASK = this.props.task;
    window.setTask();
    window.location.href = '#/tasks/comments';
  },
  render: function() {
    var isFinished = this.props.task.isFinished ? 'finished' : '';
    return (
      <div className={"task " + isFinished} onClick={this.handle}>
        <a className="taskName">
          {this.props.title}
        </a>
      </div>
    );
  }
});


export {TaskBox};
