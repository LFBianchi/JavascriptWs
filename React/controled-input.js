class ControlledInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ''
    };
	//binding this to handleChange.
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    const newValue = event.target.value
    this.setState(state => ({
		input: newValue
	}));
  }
  
  render() {
    return (
      <div>
        <input className="input" value={this.state.input} onChange={this.handleChange}></input>
        <h4>Controlled Input:</h4>
        <p>{this.state.input}</p>
      </div>
    );
  }
};
