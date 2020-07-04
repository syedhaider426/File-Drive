import React, { Fragment } from "react";
import "./App.css";
import Main from "./main_components/Main";
import Header from "./main_components/Header";
import Footer from "./main_components/Footer";

function App() {
  return (
    <Fragment>
      <Header />
      <Main />
      <Footer />
    </Fragment>
  );
}

export default App;
