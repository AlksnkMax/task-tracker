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
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  render: function() {
    return (
      <div className="commentBox">
        <h2>{TASK.taskName}</h2>
        <h3>Comments</h3>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment._id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
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
    this.props.onCommentSubmit({text: text});
    this.setState({text: ''});
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
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
    return (
      <div className="comment">
        <p className="commentAuthor">
          {this.props.author.firstName + " " + this.props.author.lastName}
        </p>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

exports.CommentBox = CommentBox;
