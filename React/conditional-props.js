class Results extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (this.props.fiftyfifty ? <h1>You Lose!</h1> : <h1>You Win!</h1>);
  }

}

class GameOfChance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 1
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({
      counter: this.state.counter + 1
    });
  }
  render() {
    const expression = Math.random() >= .5;
    return (
      <div>
        <button onClick={this.handleClick}>Play Again</button>
        <Results fiftyfifty={expression} />
        <p>{'Turn: ' + this.state.counter}</p>
      </div>
    );
  }
}
