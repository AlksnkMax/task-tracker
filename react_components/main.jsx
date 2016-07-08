import { Router, Route, hashHistory, RouteHandler } from 'react-router';

import {ProjectBox} from "./projects.jsx";
import {TaskBox} from "./tasks.jsx";
import {CommentBox} from "./comments.jsx";

var App = React.createClass({
  render: function() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={ProjectBox}/>
        <Route path={"/tasks"} component={TaskBox}/>
        <Route path={"/tasks/comments"} component={CommentBox}/>
      </Router>
    );
  }
});

ReactDOM.render(
  <App/>
  /*<Router history={hashHistory}>
    <Route path="" component={App}>
      <Route path="/" component={ProjectBox}/>
      <Route path={"/:projectName"} component={TaskBox}/>
    </Route>
  </Router>*/
, document.getElementById('content'));

/*ReactDOM.render(
  <ProjectBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);*/
