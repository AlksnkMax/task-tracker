import {ProjectBox} from "./projects.jsx";

ReactDOM.render(
  <ProjectBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
