import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";

class AccidentalButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Button
        variant="outline-primary"
        style={{
          margin: 5,
          backgroundColor:
            this.props.selectedAccidental === this.props.value
              ? "blue"
              : "white",
          color:
            this.props.selectedAccidental === this.props.value
              ? "white"
              : "blue",
        }}
        onClick={() => {
          this.props.changeSelectedAccidental(this.props.value);
        }}
      >
        {this.props.value}
      </Button>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedAccidental: state.selectedAccidental,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeSelectedAccidental: (accidental) =>
      dispatch({ type: "CHANGESELECTEDACCIDENTAL", accidental: accidental }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccidentalButton);
