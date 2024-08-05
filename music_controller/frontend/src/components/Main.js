import React from "react";
import ReactDOM from "react-dom";
import HomePage from "./HomePage";

const App = () => {
  return (
    <div className="center">
      <HomePage />
    </div>
  );
};

const appDiv = document.getElementById("app");
ReactDOM.render(<App />, appDiv);
