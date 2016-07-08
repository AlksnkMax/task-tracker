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
  // Обработчик закрытия модального окна, вызовет обработчик отказа
  close: function () {
    this.setState({
      visible: false,
      title: ''
    }, function () {
      return this.promise.reject();
    });
  },
  // Обработчик действия модального окна, вызовет обработчик действия
  action: function () {
    this.props.onSubmit({title: this.state.title});
    this.setState({
      visible: false,
      title: ''
    }, function () {
      return this.promise.resolve();
    });
  },
  // Обработчик открытия модального окна. Возвращает promise
  // ( при желании, можно передавать также названия кнопок )
  open: function (text) {
    this.setState({
      visible: true,
      text: text
    });

    // promise необходимо обновлять при каждом новом запуске окна
    this.promise = new $.Deferred();
    return this.promise;
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

    var title = this.state.title ? (
      <div className="modal-header">
        <h4 className="modal-title">{this.state.title}</h4>
      </div>
    ) : null;

    return (
      <div className={modalClass} style={modalStyles}>
        {backdrop}
        <div className="modal-dialog" style={{zIndex: "2"}}>
          <div className="modal-content">
            {this.state.text}
            <input
              className="form-control"
              type="text"
              value={this.state.title}
              onChange={this.handleTitleChange}
            />
            <div className="modal-footer">
              <button type="button" className="btn btn-default"
                onClick={this.close}>{this.state.cancel_title}
              </button>
              <button type="button" className="btn btn-primary"
                onClick={this.action}>{this.state.action_title}
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
  render: function() {
    return (
      <div>
        <a onClick={this.popup} className="btn btn-primary">{this.props.buttonTitle}</a>
        <Modal ref="foo" onSubmit={this.props.onSubmit}/>
      </div>
    );
  }
});

export {ModalButton};
