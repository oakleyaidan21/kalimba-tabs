import React from "react";
import "./App.css";
import TabCreator from "./screens/TabCreator";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { reducer } from "./redux/reducer.js";
import MenuBar from "./components/MenuBar";

const store = createStore(reducer);

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        {/* <MenuBar /> */}
        <TabCreator />
      </div>
    </Provider>
  );
}

export default App;
