import {DevList} from './devs.jsx';

var Modal = React.createClass({
  getInitialState: function () {
    return {
      visible: false,
      cancel_title: 'Cancel',
      action_title: 'Ok',
      title: '',
      text: ''
    };
  },
  close: function () {
    this.setState({
      visible: false,
      title: ''
    }, function () {
      return this.promise.reject();
    });
  },
  action: function () {
    this.props.onSubmit({title: this.state.title});
    this.setState({
      visible: false,
      title: ''
    }, function () {
      return this.promise.resolve();
    });
  },
  open: function (text) {
    this.setState({
      visible: true,
      text: text
    });
    this.promise = new $.Deferred();
    return this.promise;
  },
  loadDevs: function () {
    this.refs.foo.loadDevs();
  },
  handleTitleChange: function(e) {
    this.setState({title: e.target.value});
  },
  render: function () {
    var modalClass = this.state.visible ? "modal fade in" : "modal fade";
    var modalStyles = this.state.visible ? {display: "block"} : {};
    var backdrop = this.state.visible ? (
      <div className="modal-backdrop fade in" onClick={this.close} style={{zIndex: "1"}}/>
    ) : null;

    var inputOutput = this.props.devs ? <DevList ref="foo" scope={this.props.devScope} onSubmit={this.props.onSubmit} remove={this.props.remove}/>
      : <input className="form-control" type="text" value={this.state.title} onChange={this.handleTitleChange}/>;
    var okBtn = !this.props.devs
      ? <button type="button" className="btn btn-primary btn-ok"
          onClick={this.action}>{this.state.action_title}
        </button> : '';
    return (
      <div className={modalClass} style={modalStyles}>
        {backdrop}
        <div className="modal-dialog" style={{zIndex: "2"}}>
          <div className="modal-content">
            {this.state.text}
            {inputOutput}
            <div className="modal-footer">
              {okBtn}
              <button type="button" className="btn btn-default"
                onClick={this.close}>{this.state.cancel_title}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var ModalButton = React.createClass({
  popup: function () {
    this.refs.foo.open(this.props.windowTitle);
  },
  loadDevs: function () {
    this.refs.foo.loadDevs();
  },
  render: function() {
    return (
      <div>
        <a onClick={this.popup} className={"btn btn-primary remove-" + this.props.remove}>{this.props.buttonTitle}</a>
        <Modal ref="foo" onSubmit={this.props.onSubmit} remove={this.props.remove}
          devScope={this.props.devScope} devs={this.props.devs}/>
      </div>
    );
  }
});

export {ModalButton};
