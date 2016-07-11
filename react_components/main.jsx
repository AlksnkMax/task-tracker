import { Router, Route, hashHistory, RouteHandler } from 'react-router';

import {ProjectBox} from "./projects.jsx";
import {TaskBox} from "./tasks.jsx";
import {CommentBox} from "./comments.jsx";

var App = React.createClass({
  getInitialState: function() {
    return {user: {
      firstName: '',
      lastName: '',
      email: ''
    }};
  },
  componentDidMount: function() {
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
    var position = this.state.user.isManager ? 'Manager' : 'Developer';
    return (
      <div className='main'>
        <a className='sign-out' href="/signout">Sign out</a>
        <div className='user'>
          <p className="name">{this.state.user.firstName + " " + this.state.user.lastName}</p>
          <p className="email">{this.state.user.email}</p>
          <p>{position}</p>
        </div>
        <h1>CodeX Software</h1>
        <Router history={hashHistory}>
          <Route path="/" component={ProjectBox}/>
          <Route path={"/tasks"} component={TaskBox}/>
          <Route path={"/tasks/comments"} component={CommentBox}/>
        </Router>
      </div>
    );
  }
});

ReactDOM.render(
  <App/>
, document.getElementById('content'));
