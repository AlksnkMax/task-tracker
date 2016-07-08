window.PROJECT = {};
window.TASK = {};

if (!window.localStorage.getItem('project')) {
  window.localStorage.setItem('project', JSON.stringify(PROJECT));
}

if (!window.localStorage.getItem('task')) {
  window.localStorage.setItem('task', JSON.stringify(TASK));
}

PROJECT = JSON.parse(window.localStorage.getItem('project'));
TASK = JSON.parse(window.localStorage.getItem('task'));

window.setProject = function() {
  window.localStorage.setItem('project', JSON.stringify(PROJECT));
};

window.setTask = function() {
  window.localStorage.setItem('task', JSON.stringify(TASK));
};
