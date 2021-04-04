class CampSite extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Camper name={"Edinoelia"}/>
      </div>
    );
  }
};
// Change code below this line

const Camper = (props) => {
  return (
    <div>
      <p>{props.name}</p>
    </div>
  )
}

Camper.propTypes = { name: PropTypes.string.isRequired }
Camper.defaultProps = {
  quantity: 0
};
