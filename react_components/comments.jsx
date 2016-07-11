import {ModalButton} from './modal.jsx';

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    if (TASK && PROJECT) {
      $.ajax({
        url: '/api/getCommentList',
        dataType: 'json',
        type: 'POST',
        data: {
          'projectId': PROJECT._id,
          'taskId': TASK._id
        },
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    } else {
      this.loadCommentsFromServer();
    }
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comment._id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: '/api/addComment',
      dataType: 'json',
      type: 'POST',
      data: {
        'comment': comment.text,
        'date': comment.date,
        'projectId': PROJECT._id,
        'taskId': TASK._id
      },
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments});
      }.bind(this)
    });
  },
  handleDevSubmit: function(dev) {
    $.ajax({
      url: '/api/addDevForTask',
      dataType: 'json',
      type: 'POST',
      data: {
        'email': dev.title,
        'projectId': PROJECT._id,
        'taskId': TASK._id
      },
      success: function(data) {
        TASK.author = data;
        this.setState({});
      }.bind(this),
      error: function(xhr, status, err) {
        //this.setState({data: comments});
      }.bind(this)
    });
  },
  handleFinishTask: function() {
    $.ajax({
      url: '/api/finishTask',
      dataType: 'json',
      type: 'POST',
      data: {
        'projectId': PROJECT._id,
        'taskId': TASK._id
      },
      success: function(data) {
        TASK.isFinished = data.isFinished;
        this.setState({});
      }.bind(this),
      error: function(xhr, status, err) {
        //this.setState({data: comments});
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
    this.loadCommentsFromServer();
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
    var commentForm = (this.state.user._id == (TASK.author ? TASK.author._id : ''))
      ? <CommentForm onCommentSubmit={this.handleCommentSubmit} /> : '';
    var developer = TASK.author ? <p className='name'>{TASK.author.firstName + ' ' + TASK.author.lastName}</p> : '';
    var appointDev = (!developer && this.state.user.isManager) ? <ModalButton onSubmit={this.handleDevSubmit}
      buttonTitle='Appoint developer' devScope={true} devs={true}/> : '';
    var notFinished = (!TASK.isFinished && commentForm)
      ? <button className="btn btn-success" onClick={this.handleFinishTask}>Finish</button> : '';
    return (
      <div className="comment-box">
        <h2>{PROJECT.projectName}</h2>
        <div className='comment-title'>
          <h3>{TASK.taskName}</h3>
          {notFinished}
          {developer}
          {appointDev}
        </div>
        <h3>Comments</h3>
        <CommentList data={this.state.data} />
        {commentForm}
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment._id} date={comment.date}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="comment-list">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return { text: ''};
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.props.onCommentSubmit({text: text, date: new Date()});
    this.setState({text: ''});
  },
  render: function() {
    return (
      <form className="comment-form" onSubmit={this.handleSubmit}>
        <input
          className="form-control"
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
      <input type="submit" value="Post" className="btn btn-primary"/>
      </form>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },
  render: function() {
    var date = new Date(this.props.date);
    var [hours, minutes, month, date, year]
      = [date.getHours(), date.getMinutes(), date.getMonth()+1, date.getDate(), date.getFullYear()]
    return (
      <div className="comment">
        <p id='name'>{this.props.author.firstName + ' ' + this.props.author.lastName}</p>
        <p id='date'>{hours + ':' + minutes + '  ' + month + '.' + date + '.' + year}</p>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

exports.CommentBox = CommentBox;
