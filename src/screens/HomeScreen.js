import React, { Component } from "react";
import { Link } from "react-router-dom";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false,
    };
  }
  render() {
    console.log(this.props);
    return (
      <div>
        <Link to="/tabcreator">To Tabs screen</Link>
      </div>
    );
  }
}

export default HomeScreen;
