import React, { Component } from "react";
import { connect } from "react-redux";
import ToolBarButton from "./ToolBarButton";

class AccidentalButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ToolBarButton
        onClick={() => {
          this.props.changeSelectedAccidental(this.props.value);
        }}
        selected={this.props.value === this.props.selectedAccidental}
      >
        <div style={{ fontWeight: "bold" }}>{this.props.value}</div>
      </ToolBarButton>
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
      dispatch({ type: "CHANGE_SELECTED_ACCIDENTAL", accidental: accidental }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccidentalButton);
