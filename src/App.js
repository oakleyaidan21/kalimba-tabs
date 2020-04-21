import React from "react";
import "./App.css";
import TabCreator from "./screens/TabCreator";
import HomeScreen from "./screens/HomeScreen";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { reducer } from "./redux/reducer.js";
import { createBrowserHistory as createHistory } from "history";
import { Route, HashRouter, Switch } from "react-router-dom";
import MenuBar from "./components/MenuBar";

const store = createStore(reducer);
const history = createHistory();

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <MenuBar />
        <HashRouter history={history}>
          <Switch>
            <Route exact path="/" component={HomeScreen} />
            <Route path="/tabcreator/" component={TabCreator} />
          </Switch>
        </HashRouter>
      </div>
    </Provider>
  );
}

export default App;
