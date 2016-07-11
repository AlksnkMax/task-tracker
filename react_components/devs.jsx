import {ModalButton} from './modal.jsx';

var DevBox = React.createClass({
  handleDeveloperSubmit: function(developer, remove) {
    var url = remove ? 'removeDeveloper' : 'addDeveloper';
    $.ajax({
      url: '/api/' + url,
      dataType: 'json',
      type: 'POST',
      data: {
        'email': developer.title,
        'projectId': PROJECT._id
      },
      success: function(data) {
        this.refs.foo.loadDevs();
        this.refs.fooo.loadDevs();
        this.refs.foooo.loadDevs();
      }.bind(this)
    });
    if (remove) {
      $.ajax({
        url: '/api/updateTaskAuthor',
        dataType: 'json',
        type: 'POST',
        data: {
          'email': developer.title,
          'projectId': PROJECT._id
        },
        success: function(data) {
          this.props.loadTasks();
        }.bind(this)
      });
    }
  },
  render: function() {
    var addBtn = this.props.isManager ? <ModalButton remove={false} onSubmit={this.handleDeveloperSubmit}
      buttonTitle='Add developer' devScope={false} devs={true} ref='foo'/> : '';
    var removeBtn = this.props.isManager ? <ModalButton remove={true} onSubmit={this.handleDeveloperSubmit}
      buttonTitle='Delete developer' devScope={true} devs={true} ref='fooo'/> : '';
    return (
      <div className="dev-box">
        {addBtn}
        {removeBtn}
        <DevList scope={true} ref='foooo' notClickable={true}/>
      </div>
    );
  }
});

var DevList = React.createClass({
  loadDevs: function() {
    if (PROJECT) {
      var url = this.props.scope ? 'getDevListInProject' : 'getDevList';
      $.ajax({
        url: '/api/' + url,
        dataType: 'json',
        type: 'POST',
        data: {'projectId': PROJECT._id},
        success: function(data) {
          this.setState({devs: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    } else {
      this.loadDevs();
    }
  },
  componentDidMount: function() {
    this.loadDevs();
  },
  getInitialState: function() {
    return {
      devs: []
    };
  },
  render: function() {
    var self = this;
    var devNodes = this.state.devs.map(function(dev) {
      return (
        <Dev key={dev._id} dev={dev} notClickable={self.props.notClickable}
          onSubmit={self.props.onSubmit} remove={self.props.remove}></Dev>
      );
    });
    return (
      <div className="dev-list">
        {devNodes}
      </div>
    );
  }
});

var Dev = React.createClass({
  submit: function() {
    this.props.onSubmit({title: this.props.dev.email}, this.props.remove);
  },
  render: function() {
    var name = this.props.dev.firstName + ' ' + this.props.dev.lastName + ' ';
    var email = this.props.dev.email;
    var dev = this.props.notClickable ?
      <p><span>{name}</span>{email}</p> : <a onClick={this.submit}><span>{name}</span>{email}</a>;
    return (
      <div>
        {dev}
      </div>
    );
  }
});


export {DevBox, DevList};
